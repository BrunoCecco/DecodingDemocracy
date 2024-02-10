'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface IQuestion {
  0: string;
  1: number;
  2: string;
  3: number;
}

export default function Page({ params }: { params: { id: string } }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [analysisLink, setAnalysisLink] = useState('');
  const [prereqLink, setPrereqLink] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState<IQuestion[]>([]); // [id, consultation_id, question, multiplechoice]
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    fetch('/api/consultations/' + params.id)
      .then((response) => response.json())
      .then((data) => {
        setName(data[1]);
        setDate(data[2]);
        setLink(data[3]);
        setAnalysisLink(data[4]);
        setPrereqLink(data[5]);
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
      return question[2].toLowerCase().includes(term.toLowerCase());
    });
    setFilteredQuestions(filtered);
    if (term === '') {
      setFilteredQuestions(questions);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full flex flex-col items-center justify-between gap-8">
        <h1>{name}</h1>
        <div className="font-bold">
          Date: {new Date(date).toLocaleDateString()}
        </div>
        <div className="flex items-center justify-center gap-4">
          <a href={link} target="_blank" className="underline">
            Consultation Link
          </a>
          <a href={analysisLink} target="_blank" className="underline">
            Public Analysis Link
          </a>
          <a href={prereqLink} target="_blank" className="underline">
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
                  href={`/consultation/${params.id}/${question[0]}`}
                >
                  {question[2]}
                </Link>
              );
            })}
        </div>
      </div>
    </main>
  );
}
