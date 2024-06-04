// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import { Head } from '@inertiajs/react';

// export default function Index({ auth, availableRooms }) {
//     const [availableRooms, setAvailableRooms] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');

//     useEffect(() => {
//         const fetchAvailableRooms = async () => {
//             try {
//                 const response = await axios.get('/available-rooms');
//                 if (response.status === 200) {
//                     setAvailableRooms(response.data.availableRooms);
//                 } else {
//                     setErrorMessage('Failed to fetch available rooms.');
//                 }
//             } catch (error) {
//                 if (error.response && error.response.data) {
//                     console.error('Server Error:', error.response.data);
//                     setErrorMessage(error.response.data.message || 'Failed to fetch available rooms.');
//                 } else {
//                     console.error('Error:', error.message);
//                     setErrorMessage('Failed to fetch available rooms.');
//                 }
//             }
//         };

//         fetchAvailableRooms();
//     }, []);

//     return (
//         <AuthenticatedLayout
//             user={auth.user}
//             header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Available Rooms</h2>}
//         >
//             <Head title="Available Rooms" />
//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900 dark:text-gray-100">
//                             {errorMessage && (
//                                 <div className="mb-4 text-red-500">
//                                     {errorMessage}
//                                 </div>
//                             )}
//                             <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
//                                     <tr className="text-nowrap">
//                                         <th className="px-3 py-2">ID</th>
//                                         <th className="px-3 py-2"></th>
//                                         <th className="px-3 py-2">Room</th>
//                                         <th className="px-3 py-2">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {availableRooms.map(room => (
//                                         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={room.id}>
//                                             <td className="px-3 py-2">{room.id}</td>
//                                             <td className="px-3 py-2">
//                                                 <img src={room.image_path} style={{ width: 60 }} alt={room.name} />
//                                             </td>
//                                             <td className="px-3 py-2">{room.name}</td>
//                                             <td className="px-3 py-2">{room.status}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }
