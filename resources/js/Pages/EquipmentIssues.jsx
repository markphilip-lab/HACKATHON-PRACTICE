import { useEffect, useState } from "react";

export default function EquipmentIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        lab_number: "",
        equipment_type: "",
        issue_description: "",
        reported_by: "",
        severity: "",
    });

    // Get all equipment issues
    const fetchIssues = async () => {
        try {
            setFetching(true);

            const response = await fetch("/api/equipment-issues");

            if (!response.ok) {
                throw new Error("Failed to fetch equipment issues.");
            }

            const data = await response.json();
            setIssues(data);
        } catch (error) {
            console.error(error);
            setMessage("Unable to load equipment issues.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    // Handle form input
    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Submit new issue
    const handleSubmit = async (event) => {
        console.log("SUBMIT BUTTON WORKED");

        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/equipment-issues", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit equipment issue."
                );
            }

            setMessage("Equipment issue reported successfully.");

            setForm({
                lab_number: "",
                equipment_type: "",
                issue_description: "",
                reported_by: "",
                severity: "",
            });

            await fetchIssues();
        } catch (error) {
            console.error(error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Resolve / dismiss issue
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to resolve/dismiss this issue?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/equipment-issues/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to resolve equipment issue.");
            }

            setIssues((previous) =>
                previous.filter((issue) => issue.id !== id)
            );

            setMessage("Equipment issue resolved/dismissed.");
        } catch (error) {
            console.error(error);
            setMessage(error.message);
        }
    };

    // Severity badge styles
    const getSeverityStyle = (severity) => {
        switch (severity) {
            case "High":
                return "bg-red-100 text-red-700 border border-red-200";

            case "Medium":
                return "bg-orange-100 text-orange-700 border border-orange-200";

            case "Low":
                return "bg-gray-100 text-gray-700 border border-gray-200";

            default:
                return "bg-gray-100 text-gray-700 border border-gray-200";
        }
    };

    const highCount = issues.filter(
        (issue) => issue.severity === "High"
    ).length;

    const mediumCount = issues.filter(
        (issue) => issue.severity === "Medium"
    ).length;

    const lowCount = issues.filter(
        (issue) => issue.severity === "Low"
    ).length;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-red-600">
                            IT Support Desk
                        </p>

                        <h1 className="text-lg font-bold text-slate-900">
                            Equipment Issue Logger
                        </h1>
                    </div>

                    <div className="hidden items-center gap-6 md:flex">
                        <a
                            href="#action-form"
                            className="text-sm font-medium text-slate-600 transition hover:text-red-600"
                        >
                            Report Issue
                        </a>

                        <a
                            href="#records-table"
                            className="text-sm font-medium text-slate-600 transition hover:text-red-600"
                        >
                            Records
                        </a>

                        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            System Online
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
                    <div>
                        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-red-600">
                            Laboratory Technical Support
                        </p>

                        <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
                            Computer Lab Diagnostics & Fault Tracking Desk
                        </h2>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            Report damaged or malfunctioning laboratory
                            equipment and help the IT department keep
                            computer laboratories operational.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="#action-form"
                                className="rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
                            >
                                Report an Issue
                            </a>

                            <a
                                href="#records-table"
                                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                            >
                                View Records
                            </a>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
                        <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
                            Open Tickets
                        </p>

                        <p className="mt-3 text-6xl font-black">
                            {issues.length}
                        </p>

                        <p className="mt-3 text-slate-400">
                            Equipment issues currently recorded in the system.
                        </p>

                        <div className="mt-8 border-t border-slate-700 pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">
                                    High Priority
                                </span>

                                <span className="font-bold text-red-400">
                                    {highCount}
                                </span>
                            </div>

                            <div className="mt-3 flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Medium Priority
                                </span>

                                <span className="font-bold text-orange-400">
                                    {mediumCount}
                                </span>
                            </div>

                            <div className="mt-3 flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Low Priority
                                </span>

                                <span className="font-bold text-slate-300">
                                    {lowCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-7xl px-6 py-12">
                {/* STATUS MESSAGE */}
                {message && (
                    <div className="mb-6 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm">
                        {message}
                    </div>
                )}

                {/* FORM */}
                <section id="action-form" className="scroll-mt-28">
                    <div className="mb-6">
                        <p className="text-sm font-bold uppercase tracking-wider text-red-600">
                            Create Report
                        </p>

                        <h3 className="mt-1 text-2xl font-bold text-slate-950">
                            Laboratory Issue Logger
                        </h3>

                        <p className="mt-2 text-slate-600">
                            Provide the details of the damaged or malfunctioning
                            equipment.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* LAB */}
                            <div>
                                <label
                                    htmlFor="lab_number"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Laboratory
                                </label>

                                <select
                                    id="lab_number"
                                    name="lab_number"
                                    value={form.lab_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="">
                                        Select laboratory
                                    </option>

                                    <option value="Lab A">Lab A</option>
                                    <option value="Lab B">Lab B</option>
                                    <option value="Lab C">Lab C</option>
                                    <option value="Mac Lab">Mac Lab</option>
                                </select>
                            </div>

                            {/* EQUIPMENT */}
                            <div>
                                <label
                                    htmlFor="equipment_type"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Equipment Type
                                </label>

                                <select
                                    id="equipment_type"
                                    name="equipment_type"
                                    value={form.equipment_type}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="">
                                        Select equipment
                                    </option>

                                    <option value="Monitor">Monitor</option>
                                    <option value="Keyboard">Keyboard</option>
                                    <option value="Mouse">Mouse</option>
                                    <option value="LAN Cable">
                                        LAN Cable
                                    </option>
                                </select>
                            </div>

                            {/* REPORTED BY */}
                            <div>
                                <label
                                    htmlFor="reported_by"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Reported By
                                </label>

                                <input
                                    id="reported_by"
                                    name="reported_by"
                                    type="text"
                                    value={form.reported_by}
                                    onChange={handleChange}
                                    required
                                    placeholder="Student name / College ID Number"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            {/* SEVERITY */}
                            <div>
                                <label
                                    htmlFor="severity"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Severity
                                </label>

                                <select
                                    id="severity"
                                    name="severity"
                                    value={form.severity}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="">
                                        Select severity
                                    </option>

                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="issue_description"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Issue Description
                                </label>

                                <textarea
                                    id="issue_description"
                                    name="issue_description"
                                    value={form.issue_description}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    placeholder="Describe the equipment problem in detail..."
                                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Issue Report"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* PRIORITY SUMMARY */}
                <section className="mt-12 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                        <p className="text-sm font-medium text-red-600">
                            High Priority
                        </p>

                        <p className="mt-1 text-3xl font-black text-red-700">
                            {highCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                        <p className="text-sm font-medium text-orange-600">
                            Medium Priority
                        </p>

                        <p className="mt-1 text-3xl font-black text-orange-700">
                            {mediumCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <p className="text-sm font-medium text-slate-500">
                            Low Priority
                        </p>

                        <p className="mt-1 text-3xl font-black text-slate-700">
                            {lowCount}
                        </p>
                    </div>
                </section>

                {/* TABLE */}
                <section
                    id="records-table"
                    className="mt-12 scroll-mt-28"
                >
                    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-red-600">
                                Live Records
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-slate-950">
                                Equipment Issues
                            </h3>

                            <p className="mt-2 text-slate-600">
                                Current equipment reports recorded by the IT
                                support desk.
                            </p>
                        </div>

                        <button
                            onClick={fetchIssues}
                            disabled={fetching}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            {fetching ? "Refreshing..." : "Refresh Records"}
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Laboratory
                                        </th>

                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Equipment
                                        </th>

                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Issue
                                        </th>

                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Reported By
                                        </th>

                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Severity
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {fetching ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center text-slate-500"
                                            >
                                                Loading equipment issues...
                                            </td>
                                        </tr>
                                    ) : issues.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center"
                                            >
                                                <p className="font-semibold text-slate-700">
                                                    No equipment issues found.
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Submitted reports will
                                                    appear here.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        issues.map((issue) => (
                                            <tr
                                                key={issue.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-5 font-semibold text-slate-900">
                                                    {issue.lab_number}
                                                </td>

                                                <td className="px-6 py-5 text-slate-700">
                                                    {issue.equipment_type}
                                                </td>

                                                <td className="max-w-xs px-6 py-5 text-sm leading-6 text-slate-600">
                                                    {issue.issue_description}
                                                </td>

                                                <td className="px-6 py-5 text-slate-700">
                                                    {issue.reported_by}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getSeverityStyle(
                                                            issue.severity
                                                        )}`}
                                                    >
                                                        {issue.severity}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                issue.id
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        Resolve / Dismiss
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="mt-16 border-t border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
                    <div>
                        <p className="font-bold text-slate-950">
                            IT Support Desk
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Computer laboratory equipment issue reporting and
                            tracking system.
                        </p>
                    </div>

                    <div>
                        <p className="font-bold text-slate-950">
                            Laboratory Guidelines
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Report damaged equipment promptly and provide
                            accurate information so technical staff can
                            respond efficiently.
                        </p>
                    </div>

                    <div>
                        <p className="font-bold text-slate-950">
                            IT Custodian Office
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Office hours and support schedules are handled by
                            the assigned laboratory IT custodians.
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-100 py-5 text-center text-sm text-slate-400">
                    IT Department Equipment Issue Logger
                </div>
            </footer>
        </div>
    );
}