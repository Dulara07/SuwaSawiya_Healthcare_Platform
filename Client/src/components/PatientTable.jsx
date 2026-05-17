import React from 'react';
import { StatusBadge } from './StatusBadge';
import { MoreHorizontal } from 'lucide-react';
const patients = [{
  id: '1', name: 'Sarah Jenkins', mrn: 'MRN-88421', dob: '1982-04-12', status: 'critical', lastVisit: 'Today, 09:30', doctor: 'Dr. S. Chen', ward: 'ICU-04'
}, { id: '2', name: 'Michael Ross', mrn: 'MRN-99201', dob: '1965-11-23', status: 'stable', lastVisit: 'Yesterday', doctor: 'Dr. A. Miller', ward: 'Gen-2B' }, { id: '3', name: 'Emily Zhang', mrn: 'MRN-77392', dob: '1994-02-15', status: 'pending', lastVisit: 'Today, 11:15', doctor: 'Dr. S. Chen', ward: 'ER-01' }, { id: '4', name: 'Robert Calzone', mrn: 'MRN-11029', dob: '1958-08-30', status: 'active', lastVisit: '2 days ago', doctor: 'Dr. J. Wilson', ward: 'Cardio-3A' }, { id: '5', name: 'Anita Patel', mrn: 'MRN-44921', dob: '1979-12-05', status: 'discharged', lastVisit: '3 days ago', doctor: 'Dr. A. Miller', ward: '-' }, { id: '6', name: 'David Kim', mrn: 'MRN-33219', dob: '1988-06-18', status: 'stable', lastVisit: 'Today, 08:00', doctor: 'Dr. J. Wilson', ward: 'Gen-2A' }];
export function PatientTable() {
  return <div className="bg-white border border-[#E0E0E0] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E0E0E0] flex justify-between items-center bg-white">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Recent Admissions</h3>
        <button className="text-xs font-medium text-[#0066CC] hover:underline">View All Patients</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#E0E0E0]">
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider w-1/4">Patient Name</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">MRN</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Ward</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Assigned MD</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Last Update</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E0E0]">
            {patients.map((patient, index) => <tr key={patient.id} className={`hover:bg-[#F0F7FF] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                <td className="px-4 py-2.5"><div className="flex flex-col"><span className="text-sm font-semibold text-gray-900">{patient.name}</span><span className="text-xs text-gray-500">DOB: {patient.dob}</span></div></td>
                <td className="px-4 py-2.5 text-sm font-mono text-gray-600">{patient.mrn}</td>
                <td className="px-4 py-2.5"><StatusBadge status={patient.status} type={patient.status} /></td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{patient.ward}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 font-medium">{patient.doctor}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{patient.lastVisit}</td>
                <td className="px-4 py-2.5 text-right"><button className="text-gray-400 hover:text-[#0066CC] p-1 rounded-[2px] hover:bg-[#E6F6EC]"><MoreHorizontal className="w-4 h-4" /></button></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
