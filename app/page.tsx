/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';


// --- Types (Keep outside components) ---
type GoalStatus = 'not-started' | 'in-progress' | 'completed';
type MilestoneStatus = 'locked' | 'active' | 'completed';

interface Milestone {
    id: string;
    title: string;
    description: string;
    status: MilestoneStatus;
    dueDate?: Date;
    completedDate?: Date;
}

interface Comment {
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    timestamp: Date;
}

interface Goal {
    id: string;
    title: string;
    description: string;
    category: string;
    progress: number;
    status: GoalStatus;
    startDate: Date;
    endDate: Date;
    milestones: Milestone[];
    comments: Comment[];
    color: string;
}

interface User {
    id: string;
    name: string;
    avatar: string;
    level: number;
    goals: Goal[];
}

// --- Mock Data (Keep outside components) ---
const mockUsers: User[] = [
    {
        id: 'user1',
        name: 'Dhanush Kumar S',
        avatar: '/profile.jpg',
        level: 7,
        goals: []
    }
];

const mockGoals: Goal[] = [
    {
        id: 'goal1',
        title: 'Learn Advanced JavaScript',
        description: 'Master modern JavaScript concepts including ES6+, async/await, and design patterns',
        category: 'Education',
        progress: 65,
        status: 'in-progress',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2025-05-31'),
        color: 'from-emerald-500 to-teal-600',
        milestones: [
            {
                id: 'ms1-1',
                title: 'Complete ES6 Basics',
                description: 'Learn about arrow functions, destructuring, and template literals',
                status: 'completed'
            },
            {
                id: 'ms1-2',
                title: 'Master Promises and Async/Await',
                description: 'Understand asynchronous programming concepts',
                status: 'active'
            },
            {
                id: 'ms1-3',
                title: 'Learn Design Patterns',
                description: 'Study common JavaScript design patterns and their implementation',
                status: 'locked'
            }
        ],
        comments: [
            {
                id: 'c1-1',
                author: 'Sarah Chen',
                authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                content: 'Try the "JavaScript: The Hard Parts" course. It was super helpful for me!',
                timestamp: new Date('2024-11-15')
            }
        ]
    },
    {
        id: 'goal2',
        title: 'Run a Marathon',
        description: 'Train for and complete a full marathon in under 4.5 hours',
        category: 'Fitness',
        progress: 38,
        status: 'in-progress',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2025-08-20'),
        color: 'from-blue-500 to-indigo-600',
        milestones: [
            {
                id: 'ms2-1',
                title: 'Run 5K without stopping',
                description: 'Build baseline endurance',
                status: 'completed'
            },
            {
                id: 'ms2-2',
                title: 'Complete a half marathon',
                description: 'Participate in a local half marathon event',
                status: 'active'
            },
            {
                id: 'ms2-3',
                title: 'Maintain weekly 30-mile training',
                description: 'Consistently run 30 miles per week for a month',
                status: 'locked'
            }
        ],
        comments: [
            {
                id: 'c2-1',
                author: 'Marcus Johnson',
                authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                content: 'Have you tried interval training? It helped me improve my pace significantly.',
                timestamp: new Date('2024-12-05')
            }
        ]
    },
    {
        id: 'goal3',
        title: 'Write a Novel',
        description: 'Complete a 50,000-word sci-fi novel draft by the end of the year',
        category: 'Creative',
        progress: 20,
        status: 'in-progress',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-10-31'),
        color: 'from-purple-500 to-pink-600',
        milestones: [
            {
                id: 'ms3-1',
                title: 'Create character profiles',
                description: 'Develop detailed profiles for all main characters',
                status: 'completed'
            },
            {
                id: 'ms3-2',
                title: 'Draft plot outline',
                description: 'Create a chapter-by-chapter outline of the story',
                status: 'active'
            },
            {
                id: 'ms3-3',
                title: 'Write 25,000 words',
                description: 'Reach the halfway point of the first draft',
                status: 'locked'
            },
            {
                id: 'ms3-4',
                title: 'Complete first draft',
                description: 'Finish the entire first draft of 50,000 words',
                status: 'locked'
            }
        ],
        comments: [
            {
                id: 'c3-1',
                author: 'Elena Kim',
                authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
                content: 'Have you tried using the Pomodoro technique for writing sessions? It helps me stay focused.',
                timestamp: new Date('2024-12-12')
            }
        ]
    }
];

// Initialize mock user with goals
mockUsers[0].goals = mockGoals;

// --- Utility Functions (Keep outside components) ---
const calculateDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const end = new Date(endDate); // Ensure it's a Date object
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};


// --- Component Definitions (Defined OUTSIDE GoalTrackerComponent) ---

// --- Navbar Component ---
interface NavbarProps {
    currentUser: User;
}
const Navbar: React.FC<NavbarProps> = React.memo(({ currentUser }) => (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-xl z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span className="text-xl font-bold">Goal Odyssey</span>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                    <button className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
                        Dashboard
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="hidden md:inline">{currentUser.name}</span>
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-indigo-900"></div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
));
Navbar.displayName = 'Navbar';


interface WelcomeHeroProps {
    onAddGoalClick: () => void;
    onTutorialClick: () => void;
}
const WelcomeHero: React.FC<WelcomeHeroProps> = React.memo(({ onAddGoalClick, onTutorialClick }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [particles, setParticles] = useState<Array<{
        width: number;
        height: number;
        left: string;
        top: string;
        duration: number;
        delay: number;
    }>>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Mark as client-side for hydration safety

        const generatedParticles = Array.from({ length: 20 }).map(() => ({
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5
        }));
        setParticles(generatedParticles);
    }, []);

    if (!isClient) {
        // Render a placeholder or null during server-side rendering/initial hydration
        return <div className="relative w-full h-52 bg-gradient-to-b from-indigo-900 to-purple-800 text-white rounded-xl shadow-xl overflow-hidden"></div>;
    }


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full bg-gradient-to-b from-indigo-900 to-purple-800 text-white rounded-xl shadow-xl overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1374')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/60"></div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, index) => (
                    <motion.div
                        key={index}
                        className="absolute rounded-full bg-white/30"
                        style={{
                            width: particle.width,
                            height: particle.height,
                            left: particle.left,
                            top: particle.top,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0, 0.7, 0],
                            scale: [1, 1.2, 0.8]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: particle.duration,
                            delay: particle.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center">
                <div className="mb-6 md:mb-0 md:mr-8 md:w-2/3 z-10">
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold mb-2 inline-block bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent"
                        animate={{ scale: isHovering ? 1.03 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        Welcome to Your Goal Odyssey
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mb-4"
                    />
                    <p className="text-lg text-indigo-100 mb-6 leading-relaxed">
                        Transform your goals into epic journeys. Track your progress, celebrate milestones,
                        and turn ambitions into achievements with our immersive goal tracking experience.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <motion.button
                            onClick={onAddGoalClick} // Use prop
                            className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/30 flex items-center"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create New Goal
                        </motion.button>
                        <motion.button
                            onClick={onTutorialClick} // Use prop
                            className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-all duration-200 flex items-center backdrop-blur-sm border border-white/10"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            How It Works
                        </motion.button>
                    </div>
                </div>


                <div className="w-full md:w-1/3 flex justify-center">
                    <div className="relative w-64 h-64">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 15,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-70 blur-xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 20,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="relative w-48 h-48">
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                                    }}
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 8,
                                        ease: "easeInOut"
                                    }}
                                />
                                <motion.div className="relative w-full h-full">
                                    <Image
                                        src="/globe.svg"
                                        alt="Goal Map"
                                        fill
                                        className="object-contain filter drop-shadow-lg"
                                    />
                                    <motion.div
                                        className="absolute inset-0"
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 60,
                                            ease: "linear"
                                        }}
                                    />
                                </motion.div>

                                {/* Orbit elements - using fixed positions for hydration */}
                                {[0, 1, 2].map((index) => {
                                    const angle = (360 / 3) * index;
                                    const delay = index * 0.4;
                                    return (
                                        <motion.div
                                            key={index}
                                            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-white/70"
                                            style={{
                                                x: -1.5,
                                                y: -1.5,
                                            }}
                                            animate={{
                                                x: `${Math.cos((angle * Math.PI) / 180) * 80 - 1.5}px`,
                                                y: `${Math.sin((angle * Math.PI) / 180) * 80 - 1.5}px`,
                                            }}
                                            transition={{
                                                duration: 3,
                                                delay,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <motion.div
                                                className="w-full h-full rounded-full bg-indigo-400"
                                                animate={{
                                                    scale: [1, 1.5, 1],
                                                    opacity: [0.7, 1, 0.7]
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 2,
                                                    delay: delay * 0.5,
                                                }}
                                            />
                                        </motion.div>
                                    );
                                })}

                                {/* Central pulse */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"
                                    animate={{
                                        scale: [1, 2, 1],
                                        opacity: [0.7, 0, 0.7]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
WelcomeHero.displayName = 'WelcomeHero';

// --- GoalCard Component ---
interface GoalCardProps {
    goal: Goal;
    openGoalDetail: (goal: Goal) => void;
}
const GoalCard: React.FC<GoalCardProps> = React.memo(({ goal, openGoalDetail }) => {
    const getBackgroundElements = useCallback(() => {
        // Original logic based on goal.progress
        if (goal.progress < 25) { /*...*/ return <div className="absolute inset-0 overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white/5 to-transparent"></div></div>; }
        else if (goal.progress < 50) { /*...*/ return <div className="absolute inset-0 overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white/10 to-transparent"></div>{/* More elements */}</div>; }
        else if (goal.progress < 75) { /*...*/ return <div className="absolute inset-0 overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/15 to-transparent"></div>{/* More elements */}</div>; }
        else { /*...*/ return <div className="absolute inset-0 overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-white/20 to-transparent"></div>{/* More elements */}</div>; }
    }, [goal.progress]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            className="relative w-full rounded-xl overflow-hidden shadow-xl cursor-pointer"
            onClick={() => openGoalDetail(goal)}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-90`}></div>
            {getBackgroundElements()}

            <div className="relative p-6 text-white">
                <div className="mb-4 flex justify-between items-start">
                    <h3 className="text-xl font-bold truncate mr-2">{goal.title}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/20">
                        {goal.category}
                    </span>
                </div>

                <p className="text-sm text-white/80 mb-6 line-clamp-2">
                    {goal.description}
                </p>

                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full bg-white rounded-full"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex space-x-1 items-center">
                        {goal.milestones.slice(0, 3).map((milestone) => (
                            <div
                                key={milestone.id}
                                className={`w-2 h-2 rounded-full ${milestone.status === 'completed' ? 'bg-white' :
                                    milestone.status === 'active' ? 'bg-white/50' : 'bg-white/20'
                                    }`}
                                title={milestone.title} // Add title for accessibility
                            />
                        ))}
                        {goal.milestones.length > 3 && (
                            <span className="text-xs text-white/70 ml-1">+{goal.milestones.length - 3}</span>
                        )}
                    </div>

                    <div className="text-xs">
                        {calculateDaysRemaining(goal.endDate)} days left
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
GoalCard.displayName = 'GoalCard';

// --- GoalGrid Component ---
interface GoalGridProps {
    goals: Goal[];
    onAddGoalClick: () => void;
    openGoalDetail: (goal: Goal) => void;
}
const GoalGrid: React.FC<GoalGridProps> = ({ goals, onAddGoalClick, openGoalDetail }) => (
    <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Goals</h2>
            <button
                onClick={onAddGoalClick}
                className="px-4 py-2 rounded-full bg-indigo-600 text-white flex items-center hover:bg-indigo-700 transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Goal
            </button>
        </div>
        {goals.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 8v6m0 0v-6m0 6h.01M12 16.01V10m0 6.01h.01M12 10v.01M12 10h.01M12 10H9m3 0h3" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Embark on a New Quest!</h3>
                <p className="text-gray-500 mb-4">Your adventure awaits. Create your first goal to begin.</p>
                <button
                    onClick={onAddGoalClick}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
                >
                    Create Your First Goal
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <GoalCard 
                        key={goal.id} 
                        goal={goal} 
                        openGoalDetail={openGoalDetail} 
                    />
                ))}
            </div>
        )}
    </div>
);
GoalGrid.displayName = 'GoalGrid';


// --- Footer Component ---
const Footer = React.memo(() => (
    <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-700">Goal Odyssey</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Transform your goals into journeys</p>
                </div>
                <p className="text-sm text-gray-500 mt-4 md:mt-0">
                    © {new Date().getFullYear()} Goal Odyssey. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
));
Footer.displayName = 'Footer';

// --- AddGoalModal Component ---
interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddGoal: (goalData: { title: string; description: string; category: string; endDate: string }) => void;
}
const AddGoalModalComponent: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onAddGoal }) => {
    // --- State LOCAL to this modal ---
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDescription, setNewGoalDescription] = useState('');
    const [newGoalCategory, setNewGoalCategory] = useState('Personal');
    const [newGoalEndDate, setNewGoalEndDate] = useState('');

    // Reset form when closing/opening
    useEffect(() => {
        if (!isOpen) {
            // Delay reset slightly to allow exit animation
            const timer = setTimeout(() => {
                setNewGoalTitle('');
                setNewGoalDescription('');
                setNewGoalCategory('Personal');
                setNewGoalEndDate('');
            }, 300); // Match animation duration roughly
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        onAddGoal({
            title: newGoalTitle,
            description: newGoalDescription,
            category: newGoalCategory,
            endDate: newGoalEndDate
        });
        // No need to reset state here, useEffect handles it on close
        // No need to call onClose here, parent does it in onAddGoal handler
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4" // Higher z-index than detail modal?
                    onClick={onClose} // Close on overlay click
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", bounce: 0.25 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6 text-white">
                            <h2 className="text-xl font-bold">Create New Goal</h2>
                            <p className="text-indigo-100 text-sm">Begin your journey with a clear destination</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="goalTitle"
                                        value={newGoalTitle}
                                        onChange={(e) => setNewGoalTitle(e.target.value)}
                                        placeholder="e.g., Learn React Native"
                                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="goalDescription"
                                        value={newGoalDescription}
                                        onChange={(e) => setNewGoalDescription(e.target.value)}
                                        placeholder="Describe your goal in more detail..."
                                        className="w-full p-3  text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none placeholder-gray-400"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="goalCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="goalCategory"
                                        value={newGoalCategory}
                                        onChange={(e) => setNewGoalCategory(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700"
                                    >
                                        <option value="Personal">Personal</option>
                                        <option value="Education">Education</option>
                                        <option value="Career">Career</option>
                                        <option value="Fitness">Fitness</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Creative">Creative</option>
                                        <option value="Travel">Travel</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="goalEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Completion Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        id="goalEndDate"
                                        value={newGoalEndDate}
                                        onChange={(e) => setNewGoalEndDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]} // Prevent setting past dates
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newGoalTitle.trim()}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${newGoalTitle.trim()
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Create Goal
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
AddGoalModalComponent.displayName = 'AddGoalModalComponent';


// --- AddMilestoneModal Component ---
interface AddMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMilestone: (milestoneData: { title: string; description: string }) => void;
    goalTitle: string;
    goalColor: string;
}
const AddMilestoneModalComponent: React.FC<AddMilestoneModalProps> = ({
    isOpen,
    onClose,
    onAddMilestone,
    goalTitle,
    goalColor
}) => {
    // --- State LOCAL to this modal ---
    const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
    const [newMilestoneDescription, setNewMilestoneDescription] = useState('');

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setNewMilestoneTitle('');
                setNewMilestoneDescription('');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMilestoneTitle.trim()) return;
        onAddMilestone({
            title: newMilestoneTitle,
            description: newMilestoneDescription
        });
        // Parent handler will close the modal
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4" // Ensure higher z-index than Detail Modal
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", bounce: 0.25 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <div className={`bg-gradient-to-r ${goalColor} py-4 px-6 text-white`}>
                            <h2 className="text-xl font-bold">Add Milestone for &quot;{goalTitle}&quot;</h2>
                            <p className="text-white/80 text-sm">Break down your goal into actionable steps</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="milestoneTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="milestoneTitle"
                                        value={newMilestoneTitle}
                                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                                        placeholder="e.g., Outline Chapter 1"
                                        className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="milestoneDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        id="milestoneDescription"
                                        value={newMilestoneDescription}
                                        onChange={(e) => setNewMilestoneDescription(e.target.value)}
                                        placeholder="Add details about this milestone..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none placeholder-gray-400"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newMilestoneTitle.trim()}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${newMilestoneTitle.trim()
                                        ? `bg-gradient-to-r ${goalColor} text-white hover:opacity-90 hover:shadow-lg`
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Add Milestone
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
AddMilestoneModalComponent.displayName = 'AddMilestoneModalComponent';


// --- GoalDetailModal Component ---
interface GoalDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: Goal | null;
    currentUser: User;
    onUpdateProgress: (goalId: string, progress: number) => void;
    onUpdateMilestoneStatus: (goalId: string, milestoneId: string, status: MilestoneStatus) => void;
    onAddComment: (goalId: string, content: string) => void;
    onOpenAddMilestone: () => void;
}
const GoalDetailModalComponent: React.FC<GoalDetailModalProps> = ({
    isOpen,
    onClose,
    goal,
    currentUser,
    onUpdateProgress,
    onUpdateMilestoneStatus,
    onAddComment,
    onOpenAddMilestone
}) => {
    // --- State LOCAL to this modal ---
    const [newCommentContent, setNewCommentContent] = useState('');
    const commentTextAreaRef = useRef<HTMLTextAreaElement>(null); // Ref for focus

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setNewCommentContent(''); // Clear comment field on close
            }, 300)
            return () => clearTimeout(timer);
        } else {
            // Optionally focus comment input when modal opens
            // setTimeout(() => commentTextAreaRef.current?.focus(), 400);
        }
    }, [isOpen]);

    const handleAddCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal || !newCommentContent.trim()) return;
        onAddComment(goal.id, newCommentContent);
        setNewCommentContent(''); // Clear local state after submit
    };

    if (!goal) return null; // Don't render if no goal is selected

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" // z-index might need adjustment relative to other modals
                    onClick={onClose} // Close on overlay click
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", bounce: 0.25 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" // Allow scrolling
                        onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing on modal click
                    >
                        {/* Header with dynamic background */}
                        <div className={`sticky top-0 z-10 bg-gradient-to-r ${goal.color} h-40 rounded-t-2xl p-6 text-white`}>
                            <motion.div className="absolute inset-0 overflow-hidden rounded-t-2xl" />
                            <button
                                className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors duration-200 z-20"
                                onClick={onClose}
                                aria-label="Close goal details"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold">{goal.title}</h2>
                            <div className="flex mt-2 flex-wrap gap-2">
                                <span className="px-2 py-1 text-xs rounded-full bg-white/20 mr-2">
                                    {goal.category}
                                </span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/20">
                                    {goal.status === 'completed' ? 'Completed' :
                                        goal.status === 'in-progress' ? 'In Progress' :
                                            'Not Started'}
                                </span>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:gap-6">
                                {/* Left Column */}
                                <div className="w-full md:w-2/3">
                                    {/* Description */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">{goal.description || "No description provided."}</p>
                                    </div>

                                    {/* Progress Section */}
                                    <div className="mb-6">
                                        <div className="flex justify-between mb-2">
                                            <h3 className="text-lg font-medium text-gray-800">Progress</h3>
                                            <span className="text-indigo-600 font-medium">{goal.progress}%</span>
                                        </div>
                                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${goal.progress}%` }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                                            />
                                        </div>
                                        {/* Progress Slider */}
                                        <div className="mt-4">
                                            <label htmlFor={`progress-${goal.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                Update Progress
                                            </label>
                                            <input
                                                type="range"
                                                id={`progress-${goal.id}`} // Unique ID per goal
                                                min="0"
                                                max="100"
                                                value={goal.progress} // Controlled by parent state via prop
                                                onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Milestones Section */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-800">Milestones</h3>
                                            <button
                                                onClick={onOpenAddMilestone}
                                                className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors duration-200 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                                Add Milestone
                                            </button>
                                        </div>
                                        {goal.milestones.length === 0 ? (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <p className="text-gray-500 mb-2">No milestones created yet.</p>
                                                <button
                                                    onClick={onOpenAddMilestone}
                                                    className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center mx-auto"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                                    Create your first milestone
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {goal.milestones.map((milestone) => (
                                                    <motion.div
                                                        key={milestone.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        layout // Animate layout changes
                                                        className={`p-4 rounded-lg border transition-all duration-200 ${milestone.status === 'completed' ? 'border-green-200 bg-green-50/50' :
                                                            milestone.status === 'active' ? 'border-indigo-200 bg-indigo-50/50' :
                                                                'border-gray-200 bg-gray-50/50'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div>
                                                                <h4 className={`font-medium ${milestone.status === 'completed' ? 'text-green-700 line-through decoration-green-400' :
                                                                    milestone.status === 'active' ? 'text-indigo-700' :
                                                                        'text-gray-700'
                                                                    }`}>
                                                                    {milestone.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                                            </div>
                                                            <select
                                                                value={milestone.status}
                                                                onChange={(e) => onUpdateMilestoneStatus(
                                                                    goal.id,
                                                                    milestone.id,
                                                                    e.target.value as MilestoneStatus
                                                                )}
                                                                className={`flex-shrink-0 text-xs sm:text-sm border rounded-md py-1 px-1 sm:px-2 focus:ring-indigo-500 focus:border-indigo-500 ${milestone.status === 'completed' ? 'bg-green-100 border-green-300 text-green-700' :
                                                                    milestone.status === 'active' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' :
                                                                        'bg-gray-100 border-gray-300 text-gray-700'
                                                                    }`}
                                                                aria-label={`Status for milestone: ${milestone.title}`}
                                                            >
                                                                <option value="locked">Not Started</option>
                                                                <option value="active">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                            </select>
                                                        </div>
                                                        {milestone.completedDate && (
                                                            <div className="mt-2 text-xs text-green-600 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                Completed on {formatDate(milestone.completedDate)}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="w-full md:w-1/3">
                                    {/* Details Box */}
                                    <div className="bg-gray-100 rounded-xl p-5 mb-6 border border-gray-100 shadow-sm ">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Details</h3>
                                        <div className="space-y-4">
                                            {/* Start Date, Target Date, Days Remaining */}
                                            <DetailItem icon="calendar" label="Start Date" value={formatDate(goal.startDate)} />
                                            <DetailItem icon="flag" label="Target Date" value={formatDate(goal.endDate)} />
                                            <DetailItem icon="clock" label="Time Remaining" value={`${calculateDaysRemaining(goal.endDate)} days`} />
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-800">Comments</h3>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                {goal.comments.length}
                                            </span>
                                        </div>
                                        <div className="space-y-4 mb-4 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2">
                                            {goal.comments.length === 0 ? (
                                                <div className="text-center py-5 text-sm text-gray-500">No comments yet.</div>
                                            ) : (
                                                goal.comments.map(comment => (
                                                    <motion.div
                                                        key={comment.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        layout
                                                        className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <Image
                                                                src={comment.authorAvatar}
                                                                alt={comment.author}
                                                                width={32}
                                                                height={32}
                                                                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-baseline flex-wrap gap-x-2">
                                                                    <h4 className="font-medium text-gray-800 text-sm">{comment.author}</h4>
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatDate(comment.timestamp)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>

                                        {/* Add Comment Form */}
                                        <form onSubmit={handleAddCommentSubmit} className="mt-4">
                                            <div className="flex items-start space-x-3">
                                                <Image
                                                    src={currentUser.avatar}
                                                    alt={currentUser.name}
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full flex-shrink-0 border border-white shadow-sm mt-1 object-cover"
                                                />
                                                <div className="flex-1">
                                                    <textarea
                                                        ref={commentTextAreaRef}
                                                        value={newCommentContent} // Use local state
                                                        onChange={(e) => setNewCommentContent(e.target.value)} // Update local state
                                                        placeholder="Add your comment..."
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none placeholder-gray-500 text-gray-900 text-sm"
                                                        rows={3}
                                                        required
                                                        aria-label="Add a comment"
                                                    />
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            type="submit"
                                                            disabled={!newCommentContent.trim()}
                                                            className={`px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 ${newCommentContent.trim()
                                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 -ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                            </svg>
                                                            Send
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
GoalDetailModalComponent.displayName = 'GoalDetailModalComponent';

// --- Helper for Detail Icons ---
const DetailItem: React.FC<{ icon: 'calendar' | 'flag' | 'clock', label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
            {icon === 'calendar' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
            {icon === 'flag' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" /></svg>}
            {icon === 'clock' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>}
        </div>
        <div>
            <h4 className="text-xs text-gray-800">{label}</h4>
            <p className="font-medium text-sm text-gray-900">{value}</p>
        </div>
    </div>
);
DetailItem.displayName = 'DetailItem';


// --- TutorialModal Component ---
interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
    const tutorialSteps = [ /* ... same tutorial steps data ... */
        { title: "Welcome to Goal Odyssey", description: "Your journey to achievement begins here." },
        { title: "Set Meaningful Goals", description: "Create goals via the + button. They become realms!" },
        { title: "Track Your Progress", description: "Update progress to evolve your realms visually." },
        { title: "Create Milestones", description: "Break down goals into achievable steps." },
        { title: "Get Support", description: "Use comments to share and get feedback." }
    ];

    // Reset step when modal is closed/opened
    useEffect(() => {
        if (isOpen) {
            setCurrentTutorialStep(0);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div /* ... Modal wrapper identical to others, z-index 60? ... */
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
                    onClick={onClose} >
                    <motion.div /* ... Modal content container identical to others ... */
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.25 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()} >
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                                    {/* Animated SVG */}
                                    <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </motion.svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {tutorialSteps[currentTutorialStep].title}
                                </h2>
                            </div>
                            <p className="text-gray-600 text-center mb-8 min-h-[40px]"> {/* Min height for stability */}
                                {tutorialSteps[currentTutorialStep].description}
                            </p>

                            {/* Navigation */}
                            <div className="flex justify-between items-center">
                                <button /* ... Prev Button ... */
                                    onClick={() => setCurrentTutorialStep(Math.max(0, currentTutorialStep - 1))}
                                    disabled={currentTutorialStep === 0}
                                    className={`p-2 rounded-full ${currentTutorialStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <div className="flex space-x-2">
                                    {tutorialSteps.map((_, index) => <div key={index} className={`w-2 h-2 rounded-full ${index === currentTutorialStep ? 'bg-indigo-600' : 'bg-gray-300'}`} />)}
                                </div>
                                {currentTutorialStep < tutorialSteps.length - 1 ? (
                                    <button /* ... Next Button ... */
                                        onClick={() => setCurrentTutorialStep(Math.min(tutorialSteps.length - 1, currentTutorialStep + 1))}
                                        className="p-2 rounded-full text-gray-600 hover:bg-gray-100" >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium" >
                                        Let's Go!
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
TutorialModal.displayName = 'TutorialModal';


// --- WelcomeMessage Component ---
interface WelcomeMessageProps {
    isOpen: boolean;
    onDismiss: () => void;
    onShowTutorial: () => void;
}
const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ isOpen, onDismiss, onShowTutorial }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: 50, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 50, x: 20 }}
                className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl p-4 w-80 z-40"
            >
                {/* ... content remains the same, just uses props for actions ... */}
                <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800 text-sm">Welcome to Goal Odyssey!</h3>
                        <p className="text-sm text-gray-600 mt-1">Ready to start your adventure? Create a goal or take the tour.</p>
                        <div className="mt-3 flex space-x-2">
                            <button onClick={onShowTutorial} className="text-xs px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors duration-200 font-medium">Take Tour</button>
                            <button onClick={onDismiss} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200">Dismiss</button>
                        </div>
                    </div>
                    <button onClick={onDismiss} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600" aria-label="Dismiss welcome message"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);
WelcomeMessage.displayName = 'WelcomeMessage';

// --- Main GoalTracker Component ---
const GoalTrackerComponent = () => {
    const [currentUser, setCurrentUser] = useState<User>(() => ({ ...mockUsers[0], goals: [...mockGoals] })); // Deep copy initial state
    const [goals, setGoals] = useState<Goal[]>(() => [...mockGoals]); // Use separate state for goals
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
    const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    // Show welcome only if no goals exist initially
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(() => mockGoals.length === 0);


    // Effect to sync currentUser.goals if goals state changes elsewhere (potentially redundant if managed carefully)
    useEffect(() => {
        setCurrentUser(prev => ({ ...prev, goals: goals }));
    }, [goals]);

    const openGoalDetail = useCallback((goal: Goal) => {
        setSelectedGoal(goal);
        setIsDetailModalOpen(true);
    }, []);

    const closeDetailModal = useCallback(() => {
        setIsDetailModalOpen(false);
        setTimeout(() => setSelectedGoal(null), 300);
    }, []);

    const handleAddGoal = useCallback((goalData: { title: string; description: string; category: string; endDate: string }) => {
        const colors = ['from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-red-500 to-rose-600'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const targetDate = goalData.endDate ? new Date(goalData.endDate) : new Date(new Date().setMonth(new Date().getMonth() + 3)); // Default 3 months if no date

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison
        if (targetDate < today) {
            targetDate.setDate(today.getDate() + 1); // Set to tomorrow if user somehow selected past date
        }

        const newGoal: Goal = {
            id: `goal_${Date.now()}`, // More robust ID
            title: goalData.title.trim(),
            description: goalData.description.trim(),
            category: goalData.category,
            progress: 0,
            status: 'not-started',
            startDate: new Date(),
            endDate: targetDate,
            milestones: [],
            comments: [],
            color: randomColor
        };

        setGoals(prevGoals => [...prevGoals, newGoal]);
        setIsAddGoalModalOpen(false); // Close modal
    }, []);
    const updateGoalProgress = useCallback((goalId: string, progress: number) => {
        setGoals(prevGoals => {
            const updatedGoals = prevGoals.map(goal => {
                if (goal.id === goalId) {
                    let newStatus: GoalStatus = 'not-started';
                    if (progress === 100) newStatus = 'completed';
                    else if (progress > 0) newStatus = 'in-progress';
                    else newStatus = 'not-started';
                    const updatedGoal = { ...goal, progress: progress, status: newStatus };
                    if (selectedGoal?.id === goalId) {
                        setSelectedGoal(updatedGoal);
                    }
                    return updatedGoal;
                }
                return goal;
            });
            return updatedGoals;
        });
    }, [selectedGoal]); 

    const handleAddComment = useCallback((goalId: string, content: string) => {
        if (!content.trim()) return;

        const newComment: Comment = {
            id: `c_${goalId}_${Date.now()}`,
            author: currentUser.name,
            authorAvatar: currentUser.avatar,
            content: content.trim(),
            timestamp: new Date()
        };

        setGoals(prevGoals => {
            const updatedGoals = prevGoals.map(goal => {
                if (goal.id === goalId) {
                    const updatedGoal = { ...goal, comments: [...goal.comments, newComment] };
                    // Update selectedGoal if it matches
                    if (selectedGoal?.id === goalId) {
                        setSelectedGoal(updatedGoal);
                    }
                    return updatedGoal;
                }
                return goal;
            });
            return updatedGoals;
        });
    }, [currentUser, selectedGoal]); // Added selectedGoal

    const handleAddMilestone = useCallback((milestoneData: { title: string; description: string }) => {
        if (!selectedGoal || !milestoneData.title.trim()) return;

        const newMilestone: Milestone = {
            id: `ms_${selectedGoal.id}_${Date.now()}`,
            title: milestoneData.title.trim(),
            description: milestoneData.description.trim(),
            status: 'locked' // Start milestones as locked/not started
        };

        setGoals(prevGoals => {
            const updatedGoals = prevGoals.map(goal => {
                if (goal.id === selectedGoal.id) {
                    const updatedMilestones = [...goal.milestones, newMilestone];
                    // Recalculate progress based on NEW total milestones
                    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
                    const newProgress = updatedMilestones.length > 0
                        ? Math.round((completedCount / updatedMilestones.length) * 100)
                        : 0; // Reset progress if milestones exist but none complete, or keep 0 if none

                    const updatedGoal = {
                        ...goal,
                        milestones: updatedMilestones,
                        progress: newProgress,
                        status: newProgress === 100 ? 'completed' : (newProgress > 0 ? 'in-progress' : 'not-started') as GoalStatus
                    };
                    setSelectedGoal(updatedGoal); // Update selected goal state
                    return updatedGoal;
                }
                return goal;
            });
            return updatedGoals;
        });

        setIsAddMilestoneModalOpen(false); // Close modal
    }, [selectedGoal]);


    const updateMilestoneStatus = useCallback((goalId: string, milestoneId: string, status: MilestoneStatus) => {
        setGoals(prevGoals => {
            const updatedGoals = prevGoals.map(goal => {
                if (goal.id === goalId) {
                    // Track if status is changing to completed
                    let isNowCompleted = false;
                    const updatedMilestones = goal.milestones.map(milestone => {
                        if (milestone.id === milestoneId) {
                            isNowCompleted = status === 'completed';
                            return {
                                ...milestone,
                                status,
                                completedDate: isNowCompleted ? new Date() : undefined
                            };
                        }
                        return milestone;
                    });

                    // Calculate new progress
                    const totalMilestones = updatedMilestones.length;
                    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
                    const newProgress = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

                    // Determine new goal status
                    let newStatus: GoalStatus = goal.status;
                    if (newProgress === 100) newStatus = 'completed';
                    else if (newProgress > 0 || updatedMilestones.some(m => m.status === 'active')) newStatus = 'in-progress';
                    else newStatus = 'not-started';


                    const updatedGoal = {
                        ...goal,
                        milestones: updatedMilestones,
                        progress: newProgress,
                        status: newStatus
                    };
                    // Update selected goal if it matches
                    if (selectedGoal?.id === goalId) {
                        setSelectedGoal(updatedGoal);
                    }
                    return updatedGoal;
                }
                return goal;
            });
            return updatedGoals;
        });
    }, [selectedGoal]);


    // --- Render ---
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
            <Navbar currentUser={currentUser} />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <WelcomeHero
                    onAddGoalClick={() => setIsAddGoalModalOpen(true)}
                    onTutorialClick={() => setShowTutorial(true)}
                />

                <GoalGrid
                    goals={goals}
                    onAddGoalClick={() => setIsAddGoalModalOpen(true)}
                    openGoalDetail={openGoalDetail}
                />
            </main>

            <Footer />

            <GoalDetailModalComponent
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                goal={selectedGoal}
                currentUser={currentUser}
                onUpdateProgress={updateGoalProgress}
                onUpdateMilestoneStatus={updateMilestoneStatus}
                onAddComment={handleAddComment}
                onOpenAddMilestone={() => setIsAddMilestoneModalOpen(true)}
            />

            <AddGoalModalComponent
                isOpen={isAddGoalModalOpen}
                onClose={() => setIsAddGoalModalOpen(false)}
                onAddGoal={handleAddGoal}
            />

            {/* Check selectedGoal exists before rendering AddMilestoneModal */}
            {selectedGoal && (
                <AddMilestoneModalComponent
                    isOpen={isAddMilestoneModalOpen}
                    onClose={() => setIsAddMilestoneModalOpen(false)}
                    onAddMilestone={handleAddMilestone}
                    goalTitle={selectedGoal.title}
                    goalColor={selectedGoal.color}
                />
            )}

            <TutorialModal
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
            />

            <WelcomeMessage
                isOpen={showWelcomeMessage}
                onDismiss={() => setShowWelcomeMessage(false)}
                onShowTutorial={() => {
                    setShowTutorial(true);
                    setShowWelcomeMessage(false);
                }}
            />
        </div>
    );
};


export default function GoalTracker() {
    return <GoalTrackerComponent />;
}