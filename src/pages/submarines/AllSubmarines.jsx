import React from 'react'
import {useState , useEffect} from 'react'
import {getAllSubmarines} from '../../services/submarineService'
import { useNavigate } from 'react-router'
function AllSubmarines() {
  const [submarines, setSubmarines] = useState([])
  const navigate = useNavigate()
  
  async function fetchSubmarines(){
    const data = await getAllSubmarines()
    setSubmarines(data)
  }
  useEffect(() => {
    fetchSubmarines()
  }, [])

  return (
    <div>
      <h1>AllSubmarines</h1>
      {
        submarines.map(submarine => (
          <div key={submarine._id}>{submarine.name}
            <button onClick={() => navigate(`/submarines/${submarine._id}`)}>View</button>
          </div>
        ))
      }
    </div>
  )
}

export default AllSubmarines