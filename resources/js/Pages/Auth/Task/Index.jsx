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
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [projectList, setProjectList] = useState(projects.data);

    useEffect(() => {
        // Format dates as ISO strings if needed
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

        if (!name) {
            setErrorMessage('Name is required.');
            return;
        }
        if (!email) {
            setErrorMessage('Email is required.');
            return;
        }
        if (!start_datetime) {
            setErrorMessage('Start date and time are required.');
            return;
        }
        if (!end_datetime) {
            setErrorMessage('End date and time are required.');
            return;
        }

        const currentDate = new Date();
        const startDateTime = new Date(start_datetime);
        const endDateTime = new Date(end_datetime);

        if (startDateTime < currentDate) {
            setErrorMessage('Selected start date and time must be in the future.');
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
                                        <th className="px-3 py-2">Name</th>
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
                                                <img src={project.image_path} style={{ width: 60 }} alt={project.name} />
                                            </td>
                                            <td className="px-3 py-2">{project.name}</td>
                                            <td className="px-3 py-2">{project.status}</td>
                                            <td className="px-3 py-2">
                                                {project.status === 'Available' ? 'None' : `${new Date(project.start_datetime).toLocaleString()} - ${new Date(project.end_datetime).toLocaleString()}`}
                                            </td>
                                            <td className="px-3 py-2">{project.reserved_by || 'N/A'}</td>
                                            <td className="px-3 py-2">
                                                {project.status === 'Available' && (
                                                    <button
                                                        onClick={() => handleReserveClick(project)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                                    >
                                                        Reserve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Reserve Room for {selectedProject && selectedProject.name}</h2>
                        {errorMessage && (
                            <div className="mb-4 text-red-500">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={reservationDetails.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={reservationDetails.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Start Date and Time</label>
                                <input
                                    type="datetime-local"
                                    name="start_datetime"
                                    value={reservationDetails.start_datetime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">End Date and Time</label>
                                <input
                                    type="datetime-local"
                                    name="end_datetime"
                                    value={reservationDetails.end_datetime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={closeModal} className="px-4 py-2 mr-2 bg-gray-500 text-white rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Reserve</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isSuccessMessageVisible && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-green-500 text-white p-4 rounded">
                        Reservation Successful!
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
