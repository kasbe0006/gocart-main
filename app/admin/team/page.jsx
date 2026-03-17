'use client'

import { useEffect, useMemo, useState } from 'react'
import { Shield, UserCog, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const TEAM_KEY = 'velmora_admin_team'

const defaultTeam = [
    {
        id: 'tm_1',
        name: 'Aarav Admin',
        email: 'admin@velmora.com',
        role: 'admin',
        status: 'Active',
    },
    {
        id: 'tm_2',
        name: 'Mia Manager',
        email: 'manager@velmora.com',
        role: 'manager',
        status: 'Active',
    },
    {
        id: 'tm_3',
        name: 'Noah Staff',
        email: 'staff@velmora.com',
        role: 'staff',
        status: 'Active',
    },
]

export default function AdminTeamPage() {
    const [team, setTeam] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('manager')

    useEffect(() => {
        try {
            const stored = localStorage.getItem(TEAM_KEY)
            setTeam(stored ? JSON.parse(stored) : defaultTeam)
        } catch {
            setTeam(defaultTeam)
        }
    }, [])

    useEffect(() => {
        if (team.length) {
            localStorage.setItem(TEAM_KEY, JSON.stringify(team))
        }
    }, [team])

    const managers = useMemo(() => team.filter((member) => member.role === 'manager'), [team])
    const staffMembers = useMemo(() => team.filter((member) => member.role === 'staff'), [team])

    const addMember = () => {
        if (!name.trim() || !email.trim()) {
            toast.error('Name and email are required')
            return
        }

        const member = {
            id: `tm_${Date.now()}`,
            name: name.trim(),
            email: email.trim(),
            role,
            status: 'Active',
        }
        setTeam((prev) => [...prev, member])
        setName('')
        setEmail('')
        setRole('manager')
        toast.success(`${member.role} added successfully`)
    }

    const updateStatus = (memberId, status) => {
        setTeam((prev) => prev.map((member) => member.id === memberId ? { ...member, status } : member))
        toast.success(`Member marked ${status}`)
    }

    const changeRole = (memberId, nextRole) => {
        setTeam((prev) => prev.map((member) => member.id === memberId ? { ...member, role: nextRole } : member))
        toast.success(`Role changed to ${nextRole}`)
    }

    const MemberTable = ({ title, members }) => (
        <div className='rounded-xl border border-slate-200 bg-white p-4'>
            <h2 className='text-lg font-semibold text-slate-800'>{title}</h2>
            <div className='mt-3 overflow-x-auto'>
                <table className='w-full min-w-[620px] text-sm'>
                    <thead>
                        <tr className='bg-slate-50 border-b border-slate-200'>
                            <th className='text-left px-3 py-2'>Name</th>
                            <th className='text-left px-3 py-2'>Email</th>
                            <th className='text-left px-3 py-2'>Role</th>
                            <th className='text-left px-3 py-2'>Status</th>
                            <th className='text-left px-3 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className='border-b border-slate-100'>
                                <td className='px-3 py-2 font-medium text-slate-800'>{member.name}</td>
                                <td className='px-3 py-2'>{member.email}</td>
                                <td className='px-3 py-2'>
                                    <select
                                        value={member.role}
                                        onChange={(event) => changeRole(member.id, event.target.value)}
                                        className='border border-slate-300 rounded-md px-2 py-1 outline-none'
                                    >
                                        <option value='manager'>Manager</option>
                                        <option value='staff'>Staff</option>
                                    </select>
                                </td>
                                <td className='px-3 py-2'>
                                    <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className='px-3 py-2'>
                                    <div className='flex items-center gap-2'>
                                        <button onClick={() => updateStatus(member.id, 'Active')} className='px-2 py-1 rounded text-xs bg-green-600 text-white'>Activate</button>
                                        <button onClick={() => updateStatus(member.id, 'Blocked')} className='px-2 py-1 rounded text-xs bg-rose-600 text-white'>Block</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Team Management</h1>
            <p className='text-sm mt-1'>Different options to manage manager and staff accounts.</p>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 max-w-4xl'>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <p className='text-sm text-slate-500 inline-flex items-center gap-2'><Users size={15} /> Team Members</p>
                    <p className='text-2xl font-semibold text-slate-800 mt-1'>{team.length}</p>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <p className='text-sm text-slate-500 inline-flex items-center gap-2'><UserCog size={15} /> Managers</p>
                    <p className='text-2xl font-semibold text-indigo-600 mt-1'>{managers.length}</p>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <p className='text-sm text-slate-500 inline-flex items-center gap-2'><Shield size={15} /> Staff</p>
                    <p className='text-2xl font-semibold text-emerald-600 mt-1'>{staffMembers.length}</p>
                </div>
            </div>

            <div className='rounded-xl border border-slate-200 bg-white p-4 max-w-4xl mb-5'>
                <h2 className='font-semibold text-slate-800'>Add Manager / Staff</h2>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-2 mt-3'>
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder='Full name' className='border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder='Email address' className='border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <select value={role} onChange={(event) => setRole(event.target.value)} className='border border-slate-300 rounded-lg px-3 py-2.5 outline-none'>
                        <option value='manager'>Manager</option>
                        <option value='staff'>Staff</option>
                    </select>
                    <button onClick={addMember} className='rounded-lg bg-slate-800 text-white px-3 py-2.5'>Add Team Member</button>
                </div>
            </div>

            <div className='space-y-4 max-w-6xl'>
                <MemberTable title='Managers' members={managers} />
                <MemberTable title='Staff' members={staffMembers} />
            </div>
        </div>
    )
}
