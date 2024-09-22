import Image from 'next/image';

interface CompanyLogoProps {
  name: 'amazon' | 'apple' | 'microsoft' | 'google' | 'linkedin';
  className?: string;
}

export function CompanyLogo({ name, className = '' }: CompanyLogoProps) {
  const logos = {
    amazon: '/logos/amazon-logo.svg',
    apple: '/logos/apple-logo.svg',
    microsoft: '/logos/microsoft-logo.svg',
    google: '/logos/google-logo.svg',
    linkedin: '/logos/linkedin-logo.svg',
  };

  return (
    <div className={`w-24 h-12 relative ${className}`}>
      <Image
        src={logos[name]}
        alt={`${name} logo`}
        fill
        className="object-contain filter "
      />
    </div>
  );
}

