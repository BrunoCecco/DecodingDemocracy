'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface IConsultation {
  id: number;
  consultation_name: string;
  date: string;
  published_responses_link: string;
  government_analysis_link: string;
  prerequisite_material_link: string;
}

export default function Home() {
  const [consultations, setConsultations] = useState<IConsultation[]>([]);

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-left">
      <div className="w-full flex flex-col justify-center">
        <h1 className="my-6">Consultations</h1>
        <div className="flex flex-col gap-8 mb-12">
          {consultations &&
            consultations.map((consultation, i) => {
              return (
                <Link
                  key={i}
                  className="font-bold text-lg underline hover:text-blue-500"
                  href={`/consultation/${consultation.id}`}
                >
                  {consultation.consultation_name} ({consultation.date}) &rarr;
                </Link>
              );
            })}
        </div>
        <h2 className="mb-6">Background</h2>
        <div className="">
          Participatory democracy has been strongly influenced by the vast
          amounts of data generated from public consultations in recent years.
          <span className="italic font-bold"> Decoding Democracy </span>
          investigates the application of natural language processing and
          machine learning techniques to analyze public consultation responses
          within the context of democratic participation. By leveraging citizen
          responses data from three Scottish consultations, the project employs
          various techniques such as sentiment analysis and topic modelling to
          gauge public sentiment on commonly discussed issues. Additionally, the
          project explores the potential of semantic similarity for identifying
          similar opinions. These insights contribute to the field of
          participatory democracy by offering a data-driven method to understand
          the complexities of public opinion, potentially improving future
          policy making and consultation processes.
        </div>
      </div>
    </main>
  );
}
