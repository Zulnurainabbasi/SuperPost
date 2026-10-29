import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Mail,
  Plus,
  Shield,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { TeamMember } from '../types';

export const TeamView: React.FC = () => {
  const { teamMembers, inviteMember, removeMember, activeWorkspace } = useSuperPost();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<TeamMember['role']>('Editor');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    inviteMember(emailInput.trim(), roleInput, nameInput.trim());
    setEmailInput('');
    setNameInput('');
    setInviteModalOpen(false);
  };

  const roleColors: Record<TeamMember['role'], string> = {
    Owner: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    Admin: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    Editor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    Viewer: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Team Collaboration & RBAC</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
              {teamMembers.length} Members
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage workspace roles, approval workflows, and publishing rights for &quot;{activeWorkspace.name}&quot;
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Members Table Card */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Workspace Members</span>
          </h3>
          <span className="text-xs text-slate-400">
            {activeWorkspace.plan} Plan allows up to 15 team seats
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                />
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>{member.name}</span>
                    {member.status === 'invited' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Pending Invite
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    roleColors[member.role]
                  }`}
                >
                  {member.role}
                </span>

                {member.role !== 'Owner' && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Role Permissions Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="pb-3 pl-2">Permission</th>
                <th className="pb-3 text-center">Viewer</th>
                <th className="pb-3 text-center">Editor</th>
                <th className="pb-3 text-center">Admin</th>
                <th className="pb-3 text-center pr-2">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 pl-2 font-medium">View Calendar & Analytics</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400 pr-2">✓</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium">Draft Posts & Media Library</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400 pr-2">✓</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium">Direct Publish & Schedule</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400 pr-2">✓</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium">Connect Social Channels</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400 pr-2">✓</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium">Manage Billing & Team Members</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-emerald-400 pr-2">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleInviteSubmit}
            className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>Invite Member to {activeWorkspace.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Assigned Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Viewer', 'Editor', 'Admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoleInput(r)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        roleInput === r
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
