const URL = 'http://localhost:3000';

export const getRequest = async (url) => {
  try {
    const response = await fetch(`${URL}${url}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getResponses = async (questionid, offset, limit) => {
  return await getRequest(
    `/api/responses/${questionid}?offset=${offset}&limit=${limit}`
  );
};

export const searchResponses = async (questionid, term, offset, limit) => {
  return await getRequest(
    `/api/responses/search/${questionid}/${term}?offset=${offset}&limit=${limit}`
  );
};

export const searchSimilarResponses = async (
  questionid,
  text,
  offset,
  limit
) => {
  return await getRequest(
    `/api/responses/similar/${questionid}/${text}?offset=${offset}&limit=${limit}`
  );
};

export const searchResponseTopics = async (
  questionid,
  topic,
  offset,
  limit
) => {
  return await getRequest(
    `/api/topics/search/${questionid}/${topic}?offset=${offset}&limit=${limit}`
  );
};

export const getQuestion = async (questionid) => {
  return await getRequest(`/api/questions/${questionid}`);
};

export const getSentiment = async (questionid) => {
  return await getRequest(`/api/responses/sentiment/${questionid}`);
};

export const getAverageSentiment = async (topicid) => {
  return await getRequest(`/api/topics/averagesentiment/${topicid}`);
};

export const getTopics = async (questionid) => {
  return await getRequest(`/api/topics/${questionid}`);
};

export const getTopWords = async (topic, limit) => {
  const data = await getRequest(`/api/topics/topwords/${topic}?limit=${limit}`);
  const chart_data = {
    labels: data.map((item) => item.word),
    datasets: [
      {
        data: data.map((item) => item.word_value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  return chart_data;
};

export const getNumWordsForTopic = async (topic) => {
  return await getRequest(`/api/topics/numresponses/${topic}`);
};

export const getCommonTopics = async (questionid, topicsLimit, wordsLimit) => {
  const topics = await getRequest(
    `/api/topics/common/${questionid}?limit=${topicsLimit}`
  );

  // get common words for each topic
  const promises = topics.map(async (topic) => {
    const data = await getRequest(
      `/api/topics/topwords/${topic.topic_id}?limit=${wordsLimit}`
    );
    const chart_data = {
      labels: data.map((item) => item.word),
      datasets: [
        {
          data: data.map((item) => item.word_value),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    return [
      topic.topic_id,
      chart_data,
      topic.average_sentiment,
      topic.topic_count,
    ];
  });

  const topicsWithWords = await Promise.all(promises);
  return topicsWithWords;
};

export const getMultipleChoice = async (questionid) => {
  return await getRequest(`/api/responses/multiplechoice/${questionid}`);
};

export const getWordcloud = async (questionid) => {
  return await getRequest(`/api/questions/wordcloud/${questionid}`);
};
