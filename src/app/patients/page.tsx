import type { Metadata } from "next";
import PatientDashboard from "../../components/PatientDashboard";
export const metadata: Metadata = { title: "Patient workspace" };
export default function PatientsPage() {
  return <PatientDashboard />;
}
