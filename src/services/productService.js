const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/products`

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        const data = await res.json()

        if (data.err) {
            throw new Error(data.err)
        }
        
        return data

    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

const create = async (formData) => {
try{
    const res = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
    });

    const data = await res.json()

    if( !res.ok ){
        throw new Error(data.message || 'Failed to create product')
    }

    return data


}catch(err){
    console.log(err)
    throw new Error(err.message)
}
}

const getProduct = async (productId) => {
    try {
        const res = await fetch(`${BASE_URL}/${productId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        const data = await res.json()

        if (data.err) {
            throw new Error(data.err)
        }
        
        return data

    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
const edit = async (formData) => {
    try {
        const { productId, ...body } = formData;

        const res = await fetch(`${BASE_URL}/${productId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to edit product');
        }

        return data;

    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export {
    index,
    create,
    edit,
    getProduct
}