import axios from 'axios'
import BookForm from './components/BookForm'
import { useState } from 'react'

const App: React.FC = () => {
  const [recommendation, setRecommendation] = useState<any>(null)
  const handleSubmit = async (formData: any) => {
    try {
      const response = await axios.post(
        'http://localhost:9000/recommendation',
        {
          title: formData.title,
          categories: formData.categories,
          author: formData.author,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      console.log(response.data)
      setRecommendation(response.data)
    } catch (error) {
      console.error('Error posting data:', error)
    }
  }

  return (
    <div className=' pt-16 text-center bg-gradient-to-br from-green-200 to-emerald-400 h-screen'>
      <h1 className=' text-xl pb-4'>Recommendation</h1>
      <BookForm onSubmit={handleSubmit} />
      {recommendation && (
        <div>
          <h1 className=' text-xl mb-2'>Our recommendation for you</h1>
          <img
            src={recommendation.thumbnail}
            className='mx-auto h-[250px] mb-2'
          />
          <h2 className=' text-lg'>Title: {recommendation.title}</h2>
          <h3>Author: {recommendation.authors}</h3>
          <h3>Categories: {recommendation.categories}</h3>
        </div>
      )}
    </div>
  )
}

export default App
