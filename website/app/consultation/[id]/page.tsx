'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface IQuestion {
  consultation_id: number;
  id: string;
  multiplechoice: number;
  question: string;
}

interface IConsultation {
  consultation_name: string;
  date: string;
  published_responses_link: string;
  government_analysis_link: string;
  prerequisite_material_link: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const [consultation, setConsultation] = useState<any>({});
  const [filteredQuestions, setFilteredQuestions] = useState<IQuestion[]>([]); // [id, consultation_id, question, multiplechoice]
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    fetch('/api/consultations/' + params.id)
      .then((response) => response.json())
      .then((data) => {
        setConsultation(data);
      })
      .catch((err) => console.log(err, 'err'));

    fetch('/api/questions/' + params.id)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setFilteredQuestions(data);
      });
  }, []);

  const searchQuestions = (term: string) => {
    // filter questions based on search term
    const filtered = questions.filter((question) => {
      return question.question.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredQuestions(filtered);
    if (term === '') {
      setFilteredQuestions(questions);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full flex flex-col items-center justify-between gap-8">
        <h1>{consultation.consultation_name}</h1>
        <div className="font-bold">
          Date: {new Date(consultation.date).toLocaleDateString()}
        </div>
        <div className="flex items-center justify-center gap-4">
          <a
            href={consultation.published_responses_url}
            target="_blank"
            className="underline"
          >
            Consultation Link
          </a>
          <a
            href={consultation.government_analysis_url}
            target="_blank"
            className="underline"
          >
            Public Analysis Link
          </a>
          <a
            href={consultation.prerequisite_material_url}
            target="_blank"
            className="underline"
          >
            Prerequisite Material Link
          </a>
        </div>
        {/* Search Bar */}
        <div className="relative w-1/2">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for questions..."
            className="bg-white text-gray-800 w-full rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:border-blue-300"
            onChange={(e) => searchQuestions(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center">
          {filteredQuestions &&
            filteredQuestions.map((question: IQuestion, i) => {
              return (
                <Link
                  key={i}
                  className="p-8 mt-12 rounded bg-white shadow-md w-full hover:scale-[101%] transition-all duration-100"
                  href={`/consultation/${params.id}/${question?.id}`}
                >
                  {question?.question}
                </Link>
              );
            })}
        </div>
      </div>
    </main>
  );
}
