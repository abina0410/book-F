import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../pages/api';

export default function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}`).then(res => setBook(res.data));
  }, []);

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>Status: {book.available ? 'Available' : 'Rented'}</p>
    </div>
  );
}