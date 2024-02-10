'use client';

import { useEffect, useState } from 'react';
import { getQuestion, getMultipleChoice } from '@/app/api';
import MultipleChoiceDistribution from '@/app/components/multiplechoicedistribution';
import React from 'react';
import FreeText from '@/app/components/freetext';
import SimilarResponses from '@/app/components/similarresponses';
import Topics from '@/app/components/topics';
import Sentiment from '@/app/components/sentiment';

const Tabs = ({ children }: any) => {
  return (
    <div className="flex w-full gap-4 justify-around bg-gray-700 p-2 rounded-md">
      {children}
    </div>
  );
};

const Tab = ({ index, title, selected, setSelectedTab }: any) => {
  return (
    <div
      className={`cursor-pointer w-full text-center py-2 px-4 rounded-md ${
        selected === index
          ? 'bg-white !text-black'
          : 'text-white hover:bg-gray-600'
      }`}
      onClick={() => setSelectedTab(index)}
    >
      {title}
    </div>
  );
};

export default function Page({
  params,
}: {
  params: { id: string; questionid: string };
}) {
  const [question, setQuestion] = useState('');
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [multipleChoiceData, setMultipleChoiceData] = useState<any>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const questionData: any = await getQuestion(params.questionid);

      setQuestion(questionData[2]);
      if (questionData[3] == 1) {
        setIsMultipleChoice(true);
        setSelectedTab(-1);
        const mcData: any = await getMultipleChoice(params.questionid);
        setMultipleChoiceData(mcData);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full flex flex-col items-center justify-between gap-8 pt-8 overflow-auto relative">
        <div className="font-bold text-lg">{question}</div>
        {!isMultipleChoice && (
          <div className="flex w-full flex-col">
            <Tabs>
              <Tab
                index={0}
                title="Search Responses"
                selected={selectedTab}
                setSelectedTab={setSelectedTab}
              ></Tab>
              <Tab
                index={1}
                title="Response Similarity"
                selected={selectedTab}
                setSelectedTab={setSelectedTab}
              />
              <Tab
                index={2}
                title="Topics"
                selected={selectedTab}
                setSelectedTab={setSelectedTab}
              />
              <Tab
                index={3}
                title="Sentiment"
                selected={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            </Tabs>
          </div>
        )}
        {selectedTab === 0 && <FreeText questionid={params.questionid} />}
        {selectedTab === 1 && (
          <SimilarResponses questionid={params.questionid} />
        )}
        {selectedTab === 2 && <Topics questionid={params.questionid} />}
        {selectedTab === 3 && <Sentiment questionid={params.questionid} />}
        {isMultipleChoice && (
          <MultipleChoiceDistribution data={multipleChoiceData} />
        )}
      </div>
    </main>
  );
}
