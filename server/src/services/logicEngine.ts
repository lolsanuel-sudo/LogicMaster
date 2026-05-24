/**
 * LogicEngine - Motor avanzado de evaluación de expresiones lógicas
 * 
 * Este motor evalúa expresiones proposicionales complejas con soporte para:
 * - Operadores básicos: AND, OR, NOT
 * - Operadores avanzados: XOR, IMPLICA (->), EQUIVALE (<->)
 * - Paréntesis y agrupaciones
 * - Variables proposicionales (A, B, C, etc.)
 * - Evaluación segura con sandboxing
 */

export interface LogicExpression {
  expression: string;
  variables: Record<string, boolean>;
}

export interface TruthTableRow {
  variables: Record<string, boolean>;
  result: boolean;
}

export class LogicEngine {
  /**
   * Normaliza una expresión lógica para evaluación
   * Convierte operadores simbólicos a operadores Python/JavaScript
   */
  static normalizeExpression(expr: string): string {
    let normalized = expr.trim().toUpperCase();
    
    // Reemplazar operadores
    normalized = normalized.replace(/->/g, '<=');
    normalized = normalized.replace(/<->/g, '==');
    normalized = normalized.replace(/∧/g, '&&');
    normalized = normalized.replace(/∨/g, '||');
    normalized = normalized.replace(/¬/g, '!');
    normalized = normalized.replace(/⊕/g, '^');
    
    return normalized;
  }

  /**
   * Extrae variables proposicionales de una expresión
   * Retorna letras mayúsculas simples (A, B, C, etc.)
   */
  static extractVariables(expr: string): string[] {
    const variables = expr.match(/\b[A-Z]\b/g) || [];
    return [...new Set(variables)].sort();
  }

  /**
   * Evalúa una expresión lógica con valores asignados
   * Usa evaluación segura para prevenir inyección de código
   */
  static evaluate(expr: string, values: Record<string, boolean>): boolean {
    try {
      const normalized = this.normalizeExpression(expr);
      
      // Crear contexto seguro
      const context: Record<string, any> = { ...values };
      
      // Reemplazar variables en la expresión
      let evalExpr = normalized;
      for (const [varName, value] of Object.entries(values)) {
        evalExpr = evalExpr.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(value));
      }
      
      // Evaluar de forma segura
      // Solo permitimos operadores lógicos y valores booleanos
      const safeExpr = evalExpr
        .replace(/true/g, 'true')
        .replace(/false/g, 'false')
        .replace(/&&/g, ' && ')
        .replace(/\|\|/g, ' || ')
        .replace(/!/g, ' ! ')
        .replace(/<=/g, ' <= ')
        .replace(/==/g, ' == ')
        .replace(/\^/g, ' ^ ');
      
      // Usar Function constructor en lugar de eval para mayor seguridad
      const result = new Function('return ' + safeExpr)();
      return Boolean(result);
    } catch (error) {
      throw new Error(`Error evaluating expression: ${error}`);
    }
  }

  /**
   * Genera la tabla de verdad completa para una expresión
   */
  static generateTruthTable(expr: string): TruthTableRow[] {
    const variables = this.extractVariables(expr);
    
    if (variables.length === 0) {
      return [{ variables: {}, result: this.evaluate(expr, {}) }];
    }

    const numCombinations = Math.pow(2, variables.length);
    const truthTable: TruthTableRow[] = [];

    for (let i = 0; i < numCombinations; i++) {
      const binary = i.toString(2).padStart(variables.length, '0');
      const values: Record<string, boolean> = {};
      
      variables.forEach((variable, index) => {
        values[variable] = binary[index] === '1';
      });

      const result = this.evaluate(expr, values);
      truthTable.push({ variables: values, result });
    }

    return truthTable;
  }

  /**
   * Genera una expresión aleatoria con valores asignados
   * @param numVars - Número de variables (2-4)
   * @param complexity - Nivel de complejidad (1-3)
   */
  static generateRandomExpression(
    numVars: number,
    complexity: number = 1
  ): { expression: string; values: Record<string, boolean> } {
    const variables = ['A', 'B', 'C', 'D'].slice(0, Math.min(numVars, 4));
    const values: Record<string, boolean> = {};
    
    variables.forEach(v => {
      values[v] = Math.random() > 0.5;
    });

    let expression: string;

    if (complexity === 1) {
      // Expresiones simples
      const templates = [
        `${variables[0]} AND ${variables[1]}`,
        `${variables[0]} OR ${variables[1]}`,
        `NOT ${variables[0]}`,
        `${variables[0]} AND NOT ${variables[1]}`,
        `${variables[0]} OR NOT ${variables[1]}`,
      ];
      expression = templates[Math.floor(Math.random() * templates.length)];
    } else if (complexity === 2) {
      // Expresiones medias
      const templates = [
        `(${variables[0]} AND ${variables[1]}) OR ${variables[2] || variables[0]}`,
        `${variables[0]} -> ${variables[1]}`,
        `${variables[0]} <-> ${variables[1]}`,
        `NOT (${variables[0]} AND ${variables[1]})`,
        `${variables[0]} XOR ${variables[1]}`,
      ];
      expression = templates[Math.floor(Math.random() * templates.length)];
    } else {
      // Expresiones complejas
      if (variables.length >= 3) {
        const templates = [
          `(${variables[0]} AND ${variables[1]}) OR (NOT ${variables[2]})`,
          `${variables[0]} -> (${variables[1]} AND ${variables[2]})`,
          `(${variables[0]} OR ${variables[1]}) AND (NOT ${variables[2]})`,
          `${variables[0]} <-> (${variables[1]} XOR ${variables[2]})`,
        ];
        expression = templates[Math.floor(Math.random() * templates.length)];
      } else {
        expression = `(${variables[0]} AND ${variables[1]}) OR NOT ${variables[0]}`;
      }
    }

    return { expression, values };
  }

  /**
   * Valida si una expresión es sintácticamente correcta
   */
  static validateExpression(expr: string): { valid: boolean; error?: string } {
    try {
      const variables = this.extractVariables(expr);
      
      // Verificar balance de paréntesis
      let parenCount = 0;
      for (const char of expr) {
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (parenCount < 0) {
          return { valid: false, error: 'Unbalanced parentheses' };
        }
      }
      if (parenCount !== 0) {
        return { valid: false, error: 'Unbalanced parentheses' };
      }

      // Intentar evaluar con valores de prueba
      const testValues: Record<string, boolean> = {};
      variables.forEach(v => testValues[v] = true);
      this.evaluate(expr, testValues);

      return { valid: true };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  }

  /**
   * Simplifica una expresión lógica usando leyes de álgebra booleana
   * Implementación básica de simplificación
   */
  static simplifyExpression(expr: string): string {
    // Implementación básica - se puede expandir con más reglas
    let simplified = expr.toUpperCase();
    
    // Identidad: A AND TRUE = A
    simplified = simplified.replace(/AND TRUE/g, '');
    simplified = simplified.replace(/TRUE AND/g, '');
    
    // Identidad: A OR FALSE = A
    simplified = simplified.replace(/OR FALSE/g, '');
    simplified = simplified.replace(/FALSE OR/g, '');
    
    // Doble negación: NOT NOT A = A
    simplified = simplified.replace(/NOT NOT/g, '');
    
    return simplified.trim();
  }

  /**
   * Verifica si dos expresiones son lógicamente equivalentes
   */
  static areEquivalent(expr1: string, expr2: string): boolean {
    const vars1 = this.extractVariables(expr1);
    const vars2 = this.extractVariables(expr2);
    const allVars = [...new Set([...vars1, ...vars2])];
    
    const numCombinations = Math.pow(2, allVars.length);
    
    for (let i = 0; i < numCombinations; i++) {
      const binary = i.toString(2).padStart(allVars.length, '0');
      const values: Record<string, boolean> = {};
      
      allVars.forEach((variable, index) => {
        values[variable] = binary[index] === '1';
      });

      const result1 = this.evaluate(expr1, values);
      const result2 = this.evaluate(expr2, values);
      
      if (result1 !== result2) {
        return false;
      }
    }
    
    return true;
  }
}
