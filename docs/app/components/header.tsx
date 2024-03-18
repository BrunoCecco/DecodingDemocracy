'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Dropdown from './dropdown';

interface IOption {
  label: string;
  value: string;
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [initialOption, setInitialOption] = React.useState<IOption | null>(
    null
  );

  useEffect(() => {
    if (pathname.includes('/consultation')) {
      setInitialOption({
        label: 'Consultation ' + pathname.split('/')[2],
        value: pathname.split('/')[2],
      });
    } else {
      setInitialOption({
        label: 'Select a consultation',
        value: '',
      });
    }
  }, [pathname]);

  const handleOptionClick = (option: string) => {
    // push /consultation/{consultationid} to router
    router.push(`/consultation/${option}`);
  };

  return (
    <header className="fixed top-0 p-8 w-full bg-transparent backdrop-blur z-50">
      <div className="container mx-auto flex md:flex-row flex-col justify-between gap-4 items-center">
        {/* Logo/Title */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold">
            Decoding Democracy
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-x-12 font-bold">
          <Dropdown
            options={[
              { label: 'Consultation 1', value: '1' },
              { label: 'Consultation 2', value: '2' },
              { label: 'Consultation 3', value: '3' },
            ]}
            initialOption={initialOption}
            onOptionClick={handleOptionClick}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
