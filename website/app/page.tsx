'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function Home() {
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    console.log('fetching consultations');
    fetch('/api/consultations')
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'data');
        setConsultations(data);
      })
      .catch((err) => console.log(err, 'err'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full flex flex-col items-center justify-center">
        <h1>Consultations</h1>
        <div className="flex flex-col items-center">
          {consultations &&
            consultations.map((consultation, i) => {
              return (
                <Link
                  key={i}
                  className="p-8 mt-12 rounded bg-white shadow-md w-full hover:scale-105 transition-all duration-100"
                  href={`/consultation/${consultation[0]}`}
                >
                  {consultation[1]}
                </Link>
              );
            })}
        </div>
      </div>
    </main>
  );
}
