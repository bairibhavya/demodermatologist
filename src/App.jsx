import React from 'react';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import {Header,Footer,ScrollManager} from './components/UI';
import Home from './pages/Home';
import Treatments,{TreatmentDetail} from './pages/Treatments';
import About,{Doctors,Concerns,Clinic,FAQ,Policies} from './pages/Content';
import Booking,{Contact,RequestReceived} from './pages/Booking';
import Admin from './pages/Admin';
export default function App(){return <BrowserRouter><ScrollManager/><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/treatments" element={<Treatments/>}/><Route path="/treatments/:slug" element={<TreatmentDetail/>}/><Route path="/concerns" element={<Concerns/>}/><Route path="/about" element={<About/>}/><Route path="/doctors" element={<Doctors/>}/><Route path="/clinic" element={<Clinic/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/contact" element={<Contact/>}/><Route path="/book" element={<Booking/>}/><Route path="/request-received" element={<RequestReceived/>}/><Route path="/privacy" element={<Policies type="privacy"/>}/><Route path="/terms" element={<Policies type="terms"/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<main className="container error-page"><h1>We couldn't find that page.</h1><Link className="btn btn-terracotta" to="/">Go home</Link></main>}/></Routes><Footer/></BrowserRouter>}
