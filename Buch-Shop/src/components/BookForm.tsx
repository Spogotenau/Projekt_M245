import { useState } from 'react'

interface BookFormProps {
  onSubmit: (formData: FormData) => void
}

interface FormData {
  title: string
  author: string
  categories: string
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: '',
    categories: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ title: '', author: '', categories: '' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='m-4'>
        <label htmlFor='title'>Title:</label>
        <input
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className=' rounded-lg'
        />
      </div>
      <div className='m-4'>
        <label htmlFor='author'>Author:</label>
        <input
          type='text'
          id='author'
          name='author'
          value={formData.author}
          onChange={handleChange}
          className=' rounded-lg'
        />
      </div>
      <div>
        <label htmlFor='categories'>Categories:</label>
        <input
          type='text'
          id='categories'
          name='categories'
          value={formData.categories}
          onChange={handleChange}
          className=' rounded-lg'
        />
      </div>
      <button
        type='submit'
        className=' bg-lime-400 py-2 px-4 m-4 rounded-lg hover:bg-lime-500'
      >
        Submit
      </button>
    </form>
  )
}

export default BookForm
