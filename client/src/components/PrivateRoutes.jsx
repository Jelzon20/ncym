import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import {
  signoutSuccess
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { clearRegSuccess } from '../redux/register/registerSlice';
import Cookies from "js-cookie";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;

 
}