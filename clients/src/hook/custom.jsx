import React, { useState, useEffect } from 'react';
import api from "../context/api";
import { useNavigate } from 'react-router-dom';

const custom = () => {
    const [search, setSearch] = useState([]);
    const [result, setResult] = useState(null);
    const [userDetail, setuserDetail] = useState({});
    const [userLogin, setuserLogin] = useState(false);
    const [userList, setuserList] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userdetail"));
        if (user) {
            setuserDetail(user);
            setuserLogin(true);
            console.log(userDetail)
        } else {
            setuserLogin(false);
        }
    }, []);

    const fetchHistory = async () => {
        const token = localStorage.getItem('usertoken');
        if (!token) {
            setError('No token found, please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/api/ai/history', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(response.data.prompts || []);
            console.log(response.data);
        } catch (err) {
            setError('Failed to fetch user history.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (userLogin) {
            fetchHistory();
        }
    }, [userLogin]);


    const prompts = async (data, chatId = null) => {
        try {
            console.log('Data sent to API:', data);
            const token = localStorage.getItem("usertoken");
            console.log("Sending Token:", token);
            const headers = token && token !== "undefined" ? {
                Authorization: `Bearer ${token}`
            } : {};

            const response = await api.post('/api/ai/generate', {
                ...data,
                chatId: chatId || localStorage.getItem("chatId")
            }, { headers });

            console.log('Response from API:', response.data);
            return response.data || null;

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const signup = async (user) => {
        try {
            console.log(user);
            const response = await api.post('/api/ai/register', user);
            console.log(response.data.message);

            if (!response.data.permission) {
                alert(response.data.message);
                return { success: false, message: response.data.message };
            }

            alert(response.data.message);
            return { success: true, message: response.data.message };

        } catch (err) {
            console.error(`ERROR: ${err.message}`);
            return { success: false, message: 'An error occurred. Please try again.' };
        }
    };

    const finduser = async () => {
        const user = JSON.parse(localStorage.getItem('userdetail'));
        if (user) {
            setuserDetail(user);
            setuserLogin(true); 
        } else {
            setuserLogin(false);
        }
    };

    const saveuser = async (user) => {
        try {
            localStorage.setItem('userdetail', JSON.stringify(user));
            console.log("User saved:", user);
            setuserDetail(user);
        } catch (err) {
            console.error("Error saving user:", err);
        }
    };

    const savetoken = async (token) => {
        try {
            if (typeof token === 'string') {
                localStorage.setItem('usertoken', token);
                console.log("Token saved:", token);
            } else {
                console.warn("Invalid token type. Expected string.");
            }
        } catch (err) {
            console.error("Error saving token:", err);
        }
    };


    const login = async (userData) => {
        try {
            const response = await api.post('/api/ai/user/login', userData);

            const { token, name, email, status } = response.data;

            if (status && token) {
                await savetoken(token);
                await saveuser({ name, email });
                await finduser();
                return true;
            } else {
                console.error("No token returned from server");
                return false;
            }
        } catch (err) {
            setuserLogin(false);
            console.error(`ERROR: ${err.message}`);
            return false;
        }
    };

    const deletePrompt = async (id, token) => {
        try {
            const res = await api.delete(`/api/ai/history/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete prompt");

            return { success: true };
        } catch (err) {
            console.error("Error deleting prompt:", err);
            return { success: false, error: err.message };
        }
    };
    const editPrompt = async (id, editedPrompt) => {
        try {
            const token = localStorage.getItem('usertoken');
            const res = await api.put(`/api/ai/prompts/${id}/edit`,
                { editedPrompt },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return { success: true, output: res.data.output };
        } catch (err) {
            console.error("Error editing prompt:", err);
            return { success: false, error: err.message };
        }
    };

    const fetchPromptResponse = async ({ prompt }) => {
        try {
            const token = localStorage.getItem("usertoken");
            const res = await api.post(
                "/api/ai/generate",
                { prompt },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return { success: true, output: res.data.output };
        } catch (err) {
            console.error("Error fetching AI response:", err);
            return { success: false, error: err.message };
        }
    };

    const renamePrompt = async (id, newName) => {
        try {
            if (!newName) {
                alert("New name is required");
                return;
            }
            const token = localStorage.getItem("usertoken");
            const res = await api.put(`/api/ai/history/${id}/rename`, {
                newName,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.data;
            if (data.success) {
                alert('prompt renamed successfully');
            } else {
                alert('Rename failed');
            }
        } catch (error) {
            console.error('Error renaming prompt:', error)
        }
    }

    const sharePrompt = async (id) => {
        try {
            const token = localStorage.getItem("usertoken");
            const res = await api.post(`/api/ai/history/${id}/share`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            const data = await res.data;
            if (data?.success) {
                const shareUrl = `${window.location.origin}/api/ai/result/${id}`;
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
            } else {
                alert("Failed to share prompt.");
            }
        } catch (error) {
            console.error("Failed to share prompt:", error || error.response);
        }
    }


    return {
        prompts, signup, login, finduser, userDetail, userLogin, fetchHistory, deletePrompt, editPrompt,
        userList, setuserList, result, setResult, search, setSearch,  history, loading, error,
        fetchPromptResponse, sharePrompt, renamePrompt, savetoken, saveuser
    };

};

export default custom;