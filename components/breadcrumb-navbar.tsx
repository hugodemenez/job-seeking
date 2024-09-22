'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const steps = [
  { name: 'Offers', path: '/' },
  { name: 'Generated Documents', path: '/generated-documents' },
  {
    name: 'Training',
    path: '/training',
    subSteps: [
      { name: 'Interview Recruiter', path: '/training/interview-recruiter' },
      { name: 'Interview Hiring Manager', path: '/training/interview-hiring-manager' },
      { name: 'Salary Negotiation', path: '/training/salary-negotiation' },
    ],
  },
]

export default function ArianeNavbar() {
  const pathname = usePathname()
  const [activeStep, setActiveStep] = useState(0)
  const [activeSubStep, setActiveSubStep] = useState(-1)

  useEffect(() => {
    const updateActiveStep = () => {
      for (let i = steps.length - 1; i >= 0; i--) {
        if (pathname === steps[i].path) {
          setActiveStep(i)
          setActiveSubStep(-1)
          return
        }
        if (steps[i].subSteps) {
          const subSteps = steps[i].subSteps
          if (Array.isArray(subSteps)) {
            for (let j = subSteps.length - 1; j >= 0; j--) {
              if (pathname === subSteps[j].path) {
                setActiveStep(i)
                setActiveSubStep(j)
                return
              }
            }
          }
        }
      }
      // If no match found, set to the first step
      setActiveStep(0)
      setActiveSubStep(-1)
    }

    updateActiveStep()
  }, [pathname])

  const renderStep = (step: typeof steps[0], index: number) => {
    const isActive = index === activeStep
    const isDisabled = index > activeStep

    return (
      <li key={step.path} className="flex items-center">
        {isDisabled ? (
          <span className="text-sm font-medium text-gray-300 cursor-not-allowed">
            {step.name}
          </span>
        ) : (
          <Link
            href={step.path}
            className={`text-sm font-medium ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {step.name}
          </Link>
        )}
        {index < steps.length - 1 && (
          <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
        )}
        {isActive && step.subSteps && (
          <ol className="flex items-center space-x-4 ml-4">
            {step.subSteps.map((subStep, subIndex) => {
              const isSubActive = subIndex === activeSubStep
              const isSubDisabled = subIndex > activeSubStep

              return (
                <li key={subStep.path} className="flex items-center">
                  {isSubDisabled ? (
                    <span className="text-sm font-medium text-gray-300 cursor-not-allowed">
                      {subStep.name}
                    </span>
                  ) : (
                    <Link
                      href={subStep.path}
                      className={`text-sm font-medium ${
                        isSubActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {subStep.name}
                    </Link>
                  )}
                  {subIndex < step.subSteps.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </li>
    )
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <ol className="flex items-center space-x-4">
            {steps.map(renderStep)}
          </ol>
        </div>
      </div>
    </nav>
  )
}