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
  getSentiment,
  getSentimentForTopic,
} from '@/app/api';
import CommonTopics from '@/app/components/commontopics';
import Dropdown from '@/app/components/dropdown';
import SentimentDistribution from '@/app/components/sentimentdistribution';
import Responses from '@/app/components/responses';
import React from 'react';
import { IResponse } from '@/app/api/interfaces';
import { useLocalStorage } from 'usehooks-ts';

interface ITopic {
  0: string; // id
  1: any; // chart data
  2: number; // number of responses
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
  const [positiveSentiment, setPositiveSentiment] = useState(0);
  const [negativeSentiment, setNegativeSentiment] = useState(0);
  const [selectedTopic, setSelectedTopic] = useLocalStorage('selectedTopic', {
    label: 'Select a topic',
    value: '',
  });
  const [rendered, setRendered] = useState(false);

  const defaultTopic = { label: 'Select a topic', value: '' };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      var sentimentData: any;
      console.log(selectedTopic);
      if (selectedTopic === null) {
        setSelectedTopic(defaultTopic);
        sentimentData = await getSentiment(questionid);
        setPositiveSentiment(sentimentData?.positive);
        setNegativeSentiment(sentimentData?.negative);
      }
      if (selectedTopic.value === '') {
        const responsesData: any = await getResponses(
          questionid,
          offset,
          limit
        );
        setFilteredResponses(responsesData);
        sentimentData = await getSentiment(questionid);
        setPositiveSentiment(sentimentData?.positive);
        setNegativeSentiment(sentimentData?.negative);
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
        [defaultTopic].concat(
          topicsData.map((topic: any) => {
            return {
              label:
                topic.topic_id.split('-')[2] +
                ': ' +
                topic.topic_count +
                ' responses',
              value: topic.topic_id,
            };
          })
        )
      );
      filterTopics(selectedTopic.value);
      setRendered(true);
    };
    fetchData();
  }, [offset, limit]);

  const filterTopics = async (topic: string) => {
    if (topic === defaultTopic.value) {
      setSelectedTopic(defaultTopic);
      const commonTopicsData: any = await getCommonTopics(
        questionid,
        topicsLimit,
        wordsLimit
      );
      setSelectedTopics(commonTopicsData);
      return;
    }
    setSelectedTopic({ label: topic, value: topic });
    const responsesData: any = await searchResponseTopics(
      questionid,
      topic,
      offset,
      limit
    );
    const topicSentiment: any = await getSentimentForTopic(topic);
    setPositiveSentiment(topicSentiment.positive);
    setNegativeSentiment(topicSentiment.negative);
    setFilteredResponses(responsesData);
    const numWordsData: any = await getNumWordsForTopic(topic);
    const topWordsData: any = await getTopWords(topic, wordsLimit);
    const sentimentData: any = await getSentimentForTopic(topic);
    setSelectedTopics([
      {
        0: topic,
        1: topWordsData,
        2: numWordsData.topic_count,
      },
    ]);
  };

  return (
    rendered && (
      <div className="flex w-full flex-col gap-4 items-center justify-center">
        {topics && topics.length > 0 && (
          <Dropdown
            options={topics}
            initialOption={selectedTopic}
            onOptionClick={filterTopics}
          />
        )}
        {selectedTopics?.length > 0 && (
          <CommonTopics
            topics={selectedTopics}
            title={
              selectedTopic.value == ''
                ? 'Most Common Topics'
                : 'Topic ' + selectedTopic.value + ' Words'
            }
          />
        )}
        <SentimentDistribution
          positive={positiveSentiment}
          negative={negativeSentiment}
          title={
            selectedTopic.value == ''
              ? 'Overall Sentiment Distribution'
              : 'Topic ' + selectedTopic.value + ' Sentiment Distribution'
          }
        />
        <Responses responses={filteredResponses} />
        <div className="flex justify-center items-center w-full gap-4">
          <Button onClick={() => setOffset(Math.max(offset - limit, 0))}>
            Previous
          </Button>
          <Button onClick={() => setOffset(offset + limit)}>Next</Button>
        </div>
      </div>
    )
  );
}
