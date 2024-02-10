'use client';

import { useEffect, useState } from 'react';
import Button from '@/app/components/button';
import {
  getResponses,
  searchResponseTopics,
  getCommonTopics,
  getTopics,
  getTopWords,
  getNumWordsForTopic,
} from '@/app/api';
import CommonTopics from '@/app/components/commontopics';
import Dropdown from '@/app/components/dropdown';
import Responses from '@/app/components/responses';
import React from 'react';

interface IResponse {
  0: number; // id
  1: string; // question_id
  2: number; // responder_id
  3: string; // response
  4: number; // consultation_id
  5: number; // sentiment value
  6: string; // primary topic
}

interface ITopic {
  0: string; // id
  1: any; // chart data
  2: number; // sentiment value
  3: number; // number of responses
}

interface IOption {
  label: string;
  value: string;
}

export default function Page({ questionid }: { questionid: string }) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [selectedTopics, setSelectedTopics] = useState<ITopic[]>([]);
  const [topicsLimit, setTopicsLimit] = useState(3);
  const [wordsLimit, setWordsLimit] = useState(10);
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const [topics, setTopics] = useState<IOption[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<IOption>({
    label: 'Select a topic',
    value: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (selectedTopic.value === '') {
        const responsesData: any = await getResponses(
          questionid,
          offset,
          limit
        );
        setFilteredResponses(responsesData);
      } else {
        const responsesData: any = await searchResponseTopics(
          questionid,
          selectedTopic.value,
          offset,
          limit
        );
        setFilteredResponses(responsesData);
      }

      const topicsData: any = await getTopics(questionid);
      setTopics(
        topicsData.map((topic: any) => {
          return {
            label: topic[0] + ': ' + topic[1] + ' responses',
            value: topic[0],
          };
        })
      );
      const commonTopicsData: any = await getCommonTopics(
        questionid,
        topicsLimit,
        wordsLimit
      );
      setSelectedTopics(commonTopicsData);
    };
    fetchData();
  }, [offset, limit]);

  const filterTopics = async (topic: string) => {
    setSelectedTopic({ label: topic, value: topic });
    const responsesData: any = await searchResponseTopics(
      questionid,
      topic,
      offset,
      limit
    );
    setFilteredResponses(responsesData);
    console.log(topic);
    const numWordsData: any = await getNumWordsForTopic(topic);
    console.log(numWordsData);
    const topWordsData: any = await getTopWords(topic, wordsLimit);
    setSelectedTopics([
      {
        0: topic,
        1: topWordsData,
        2: 0,
        3: numWordsData,
      },
    ]);
  };

  return (
    <div className="flex w-full flex-col gap-4 items-center justify-center">
      {topics && topics.length > 0 && (
        <Dropdown
          options={topics}
          initialOption={selectedTopic}
          onOptionClick={filterTopics}
        />
      )}
      {selectedTopics?.length > 0 && <CommonTopics topics={selectedTopics} />}
      <Responses responses={filteredResponses} />
      <div className="flex justify-center items-center w-full gap-4">
        <Button onClick={() => setOffset(Math.max(offset - limit, 0))}>
          Previous
        </Button>
        <Button onClick={() => setOffset(offset + limit)}>Next</Button>
      </div>
    </div>
  );
}
