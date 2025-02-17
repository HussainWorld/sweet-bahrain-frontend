import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as productService from '../../services/productService'

const Dashboard = () => {
  const { user } = useContext(UserContext);

  // const [listOfUsers, setListOfUsers] = useState([])

  const [productsList, setProductsList] = useState([])

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //       try {
  //           const fetchedUsers = await userService.index()
  //           setListOfUsers(fetchedUsers)
  //       } catch (err) {
  //           console.log(err)
  //       }
  //   }

  //   if (user) fetchUsers()
  // }, [user])


  useEffect(() => {
    const fetchingProducts = async () => {
        try {
            const fetchedProducts = await productService.index()
            setProductsList(fetchedProducts)
        } catch (err) {
            console.log(err)
        }
    }

    if (user) fetchingProducts()
  }, [user])

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <h1>SWEET BAHRAIN</h1>
      <h3>CHOCOLATE</h3>

      {productsList.map((prdObj) => (
        <>
        <img src={prdObj.image} alt={prdObj.name} />
        <h4 key={prdObj._id}>{prdObj.name} BHD {prdObj.price}</h4>
        </>
      ))}
    </main>
  );
};

export default Dashboard