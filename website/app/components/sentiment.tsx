'use client';

import { useEffect, useState } from 'react';
import { getSentiment } from '@/app/api';
import SentimentDistribution from '@/app/components/sentimentdistribution';
import React from 'react';

export default function Sentiment({ questionid }: { questionid: string }) {
  const [positiveSentiment, setPositiveSentiment] = useState(0);
  const [negativeSentiment, setNegativeSentiment] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const sentimentData: any = await getSentiment(questionid);
      setPositiveSentiment(sentimentData.positive);
      setNegativeSentiment(sentimentData.negative);
    };
    fetchData();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 items-center justify-center">
      <SentimentDistribution
        positive={positiveSentiment}
        negative={negativeSentiment}
      />
    </div>
  );
}
