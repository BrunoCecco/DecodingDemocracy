import React from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface IResponse {
  id: number;
  question_id: string;
  responder_id: number;
  response: string;
  consultation_id: number;
  sentiment_value?: number;
  topic_id: string;
  similarity_score?: number;
}

const Response = ({ response }: { response: IResponse }) => {
  const [selectedTopic, setSelectedTopic] = useLocalStorage('selectedTopic', {
    label: 'Select a topic',
    value: '',
  });
  const [selectedTab, setSelectedTab] = useLocalStorage('selectedTab', 0);

  const selectTopic = (topicId: string) => {
    setSelectedTab(2);
    setSelectedTopic({ label: topicId, value: topicId });
  };

  return (
    <tr className="text-sm">
      <td className="text-left">{response.id}</td>
      <td className="text-left">{response.response}</td>
      {response?.sentiment_value != null && (
        <td className="text-left">{response.sentiment_value || 'n/a'}</td>
      )}
      {response?.topic_id != null && (
        <td className="text-left">
          <div
            onClick={() => selectTopic(response.topic_id)}
            className="cursor-pointer text-blue-700 hover:opacity-75"
          >
            {response.topic_id?.split('-')[2] || 'n/a'}
          </div>
        </td>
      )}
      {response?.similarity_score != null && (
        <td className="text-left">
          {response.similarity_score?.toFixed(2) || 'n/a'}
        </td>
      )}
    </tr>
  );
};

const Responses = ({ responses }: { responses: IResponse[] }) => {
  return (
    <table className="w-full border-separate border-spacing-2 table-auto border-spacing-6">
      <thead>
        <tr className="border-b border-black">
          <th className="text-left">No.</th>
          <th className="text-left">Response</th>
          {responses[0]?.sentiment_value != null && (
            <th className="text-left">Sentiment Value</th>
          )}
          {responses[0]?.topic_id != null && (
            <th className="text-left">Topic ID</th>
          )}
          {responses[0]?.similarity_score != null && (
            <th className="text-left">Similarity Score</th>
          )}
        </tr>
      </thead>
      <tbody>
        {responses?.map((response: IResponse, i) => {
          return <Response key={i} response={response} />;
        })}
      </tbody>
    </table>
  );
};

export default Responses;
