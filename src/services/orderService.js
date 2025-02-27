const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/orders`

const create = async (productId) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    })
    const data = await res.json()

    if (data.err) {
      throw new Error(data.err)
    }
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

const getOrders = async () => {
  try{
    const res = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Const-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem*('token')}`
      }
    });

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.err || 'Failed to fetch orders');
    }
    
    return data;

  }catch(err){
    throw new Error(err.message)
  }
}



export { create, getOrders }