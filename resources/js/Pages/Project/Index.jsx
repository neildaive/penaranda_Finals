import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';

export default function Index({ auth, projects }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [reservationDetails, setReservationDetails] = useState({
        name: '',
        email: '',
        start_datetime: '',
        end_datetime: '',
    });
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomType, setNewRoomType] = useState('');
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [projectList, setProjectList] = useState([]);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

    useEffect(() => {
        const formattedProjects = projects.data.map(project => ({
            ...project,
            start_datetime: project.start_datetime ? new Date(project.start_datetime).toISOString() : null,
            end_datetime: project.end_datetime ? new Date(project.end_datetime).toISOString() : null,
        }));
        setProjectList(formattedProjects);
    }, [projects.data]);

    const handleReserveClick = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleMakeAvailableClick = async (project) => {
        try {
            const response = await axios.post(`/reservations/${project.id}/make-available`);
            if (response.status === 200) {
                const updatedProject = response.data.project;
                const updatedProjects = projectList.map(proj =>
                    proj.id === updatedProject.id ? updatedProject : proj
                );
                setProjectList(updatedProjects);
                setIsSuccessMessageVisible(true);
                setTimeout(() => setIsSuccessMessageVisible(false), 3000);
            } else {
                setErrorMessage('Failed to make the room available.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Server Error:', error.response.data);
                setErrorMessage(error.response.data.message || 'Failed to make the room available.');
            } else {
                console.error('Error:', error.message);
                setErrorMessage('Failed to make the room available.');
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
        setReservationDetails({
            name: '',
            email: '',
            start_datetime: '',
            end_datetime: '',
        });
        setErrorMessage('');
    };

    const closeRoomModal = () => {
        setIsRoomModalOpen(false);
        setNewRoomName('');
        setNewRoomType('');
        setErrorMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, start_datetime, end_datetime } = reservationDetails;

        if (!name || !email || !start_datetime || !end_datetime) {
            setErrorMessage('All fields are required.');
            return;
        }

        const currentDate = new Date();
        const startDateTime = new Date(start_datetime);
        const endDateTime = new Date(end_datetime);

        if (startDateTime < currentDate) {
            setErrorMessage('Start date and time must be in the future.');
            return;
        }
        if (endDateTime <= startDateTime) {
            setErrorMessage('End date and time must be after the start date and time.');
            return;
        }

        try {
            const response = await axios.post(`/reservations/${selectedProject.id}/reserve`, reservationDetails);
            if (response.status === 200) {
                const updatedProject = response.data.project;
                const updatedProjects = projectList.map(project =>
                    project.id === updatedProject.id ? updatedProject : project
                );
                setProjectList(updatedProjects);
                setIsModalOpen(false);
                setIsSuccessMessageVisible(true);
                setTimeout(() => setIsSuccessMessageVisible(false), 3000);
            } else {
                setErrorMessage('Failed to reserve the room.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Server Error:', error.response.data);
                setErrorMessage(error.response.data.message || 'Failed to reserve the room.');
            } else {
                console.error('Error:', error.message);
                setErrorMessage('Failed to reserve the room.');
            }
        }
    };

    const handleAddRoomClick = () => {
        setIsRoomModalOpen(true);
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();

        if (!newRoomName || !newRoomType) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            const response = await axios.post(`/rooms`, { name: newRoomName, type: newRoomType });
            if (response.status === 200) {
                setProjectList([...projectList, response.data.room]);
                setIsRoomModalOpen(false);
                setIsSuccessMessageVisible(true);
                setTimeout(() => setIsSuccessMessageVisible(false), 3000);
            } else {
                setErrorMessage('Failed to add the new room.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Server Error:', error.response.data);
                setErrorMessage(error.response.data.message || 'Failed to add the new room.');
            } else {
                console.error('Error:', error.message);
                setErrorMessage('Failed to add the new room.');
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Room Reservation</h2>}
        >
            <Head title="Reservations" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">ID</th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">Room</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Reservation Period</th>
                                        <th className="px-3 py-2">Reserved By</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectList.map(project => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={project.id}>
                                            <td className="px-3 py-2">{project.id}</td>
                                            <td className="px-3 py-2">
                                                <img
                                                    src={project.status === 'Available' ? 'https://htmlcolorcodes.com/assets/images/colors/green-color-solid-background-1920x1080.png' : 'https://htmlcolorcodes.com/assets/images/colors/dark-red-color-solid-background-1920x1080.png'}
                                                    style={{ width: 60 }}
                                                    alt={project.name}  
                                                />
                                            </td>
                                            <td className="px-3 py-2">{project.name}</td>
                                            <td className="px-3 py-2">{project.status}</td>
                                            <td className="px-3 py-2">
                                                {project.status === 'Available' ? 'None' : `${new Date(project.start_datetime).toLocaleString()} - ${new Date(project.end_datetime).toLocaleString()}`}
                                            </td>
                                            <td className="px-3 py-2">{project.reserved_by || 'N/A'}</td>
                                            <td className="px-3 py-2">
                                                {project.status === 'Available' ? (
                                                    <button
                                                        onClick={() => handleReserveClick(project)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                                    >
                                                        Reserve
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleMakeAvailableClick(project)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded"
                                                    >
                                                        Make Available
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={handleAddRoomClick}
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Add Room
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Reserve Room</h2>
                        {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={reservationDetails.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={reservationDetails.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="start_datetime"
                                    value={reservationDetails.start_datetime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="end_datetime"
                                    value={reservationDetails.end_datetime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Reserve
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
                        {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
                        <form onSubmit={handleRoomSubmit}>
                            <div className="mb-4">
                                <label htmlFor="newRoomName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Room Name</label>
                                <input
                                    type="text"
                                    name="newRoomName"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newRoomType" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Room Type</label>
                                <input
                                    type="text"
                                    name="newRoomType"
                                    value={newRoomType}
                                    onChange={(e) => setNewRoomType(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeRoomModal}
                                    className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Add Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
