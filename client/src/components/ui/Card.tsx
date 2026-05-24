import { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl border border-slate-800 bg-slate-950/50 backdrop-blur-xl', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

function CardTitle({ className, ...props }: CardProps) {
  return <h3 className={cn('text-2xl font-bold leading-none tracking-tight text-white', className)} {...props} />
}

function CardDescription({ className, ...props }: CardProps) {
  return <p className={cn('text-sm text-slate-400', className)} {...props} />
}

function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

function CardFooter({ className, ...props }: CardProps) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
