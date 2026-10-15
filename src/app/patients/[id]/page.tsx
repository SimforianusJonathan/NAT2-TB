import { notFound } from "next/navigation";
import { demoPatients } from "../../../data/patients";
import PatientDetail from "../../../components/PatientDetail";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `${id} · Patient case` };
}
export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!demoPatients.some((p) => p.id === id)) notFound();
  return <PatientDetail id={id} />;
}
