from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import demoji
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

nltk.download('punkt')
nltk.download('wordnet')


# Custom stopwords that don't include negations like "not" or didn't so sentiment analysis is not impacted
stopwords = set([
    "a", "an", "the", "this", "that", "it", "is", "am", "are", "was", "were", "be", "being", "been",
    "have", "has", "had", "do", "does", "did", "doing", "and", "or", "but", "on", "in", "at", "by",
    "with", "of", "for", "as", "to", "from", "up", "down", "why", "how", "when", "where", "what",
    "should", "would", "could", "might", "may", "must", "shall", "can", "will", "i", "you", "he", "she",
    "we", "they", "my", "your", "his", "her", "its", "our", "their", "me", "him", "us", "them", "yours",
    "mine", "hers", "ours", "theirs"
])
lemmatizer = WordNetLemmatizer()

# Returns tokenised words in root form
def pre_process(text, stops=None):
    if text is None:
      return None
    punct = '!"#$%&\'()*+-/<=>?@[\\]^`{|}~.,'
    text = text.lower()
    # Remove punctuation
    text = ''.join([char for char in text if char not in punct])
    # Remove emojis
    text = demoji.replace(text,'')
    # Tokenize
    text = word_tokenize(text)
    if stops is not None:
      # Remove custom stopwords
      text = [w for w in text if not w in stops]
    # Lemmatize (reduce words to root form)
    text = [lemmatizer.lemmatize(token) for token in text]
    return text

# Semantic similarity between search text and other responses within a question
def semantic_similarity_text(text_embedding, q_embeddings):
    # Get the similarity scores for the input text and each response
    similarity_text = cosine_similarity([text_embedding], q_embeddings) 
    similarities_text_sorted = similarity_text.argsort() # Sort the similarity scores
    score = []
    ids = []

    # build a dataframe with the sorted similarity scores
    for i in range(-1, -(len(similarity_text[0])), -1):
        similar_index = similarities_text_sorted[0][i]
        rank = similarity_text[0][similar_index]
        score.append(rank)
        ids.append(similar_index)
    index_text_df = pd.DataFrame({'id': ids, 'score': score})

    return index_text_df