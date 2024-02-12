"use client";

// Import necessary hooks and libraries
import { useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
//import { useAccount } from 'wagmi';
import { createHackathonEntry } from "~~/app/hackathon";

// Define types for your state
interface TeamMember {
  name: string;
  email: string;
  role: string;
}

interface HackathonEntry {
  projectName: string;
  problemStatement: string;
  solutionDescription: string;
  implementationDescription: string;
  technologyStack: string[];
  teamMembers: TeamMember[];
}

const Home: NextPage = () => {
  //const { address } = useAccount();

  // Initialize form state with structure expected by your backend
  const [formData, setFormData] = useState<HackathonEntry>({
    projectName: "",
    problemStatement: "",
    solutionDescription: "",
    implementationDescription: "",
    technologyStack: [],
    teamMembers: [],
  });

  // Handler for text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // For simplicity, assuming there's a way to capture the input for technologyStack and teamMembers not shown here
  const [techInput, setTechInput] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [teamInputEmail, setTeamInputMail] = useState("");
  const [teamInputRole, setTeamInputRole] = useState("");

  // Handlers for tech stack and team members
  const handleAddTech = () => {
    if (!techInput) return; // Prevent adding empty values
    setFormData({
      ...formData,
      technologyStack: [...formData.technologyStack, techInput],
    });
    setTechInput(""); // Reset input
  };

  const handleAddTeamMember = () => {
    if (!teamInput) return; // Similar guard
    const newMember = { name: teamInput, email: teamInputEmail, role: teamInputRole }; // Simplify for demonstration
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, newMember],
    });
    setTeamInput("");
    setTeamInputMail("");
    setTeamInputRole(""); // Reset input
  };

  // Simplified handleSubmit function for demonstration
  const handleSubmit = async () => {
    try {
      // Validate or prepare data as needed before submission
      const entry = await createHackathonEntry(formData);
      toast(`Project Information: ${JSON.stringify(entry.getProjectInfo())}`);
      toast.success("Hackathon entry submitted successfully");
    } catch (error) {
      toast.error("Submission failed");
      console.error(error);
    }
  };

  // Render form (simplified for demonstration)
  return (
    <div>
      <input
        name="projectName"
        onChange={handleInputChange}
        placeholder="Project Name"
        className={"text-black"}
        value={formData.projectName}
      />
      <input
        name="problemStatement"
        onChange={handleInputChange}
        placeholder="Problem Statement"
        className={"text-black"}
        value={formData.problemStatement}
      />
      <input
        name="solutionDescription"
        onChange={handleInputChange}
        placeholder="Solution"
        className={"text-black"}
        value={formData.solutionDescription}
      />
      <input
        name="implementationDescription"
        onChange={handleInputChange}
        placeholder="implementationDescription"
        className={"text-black"}
        value={formData.implementationDescription}
      />
      {/* Include other inputs similarly */}

      {/* Tech Input */}
      <input
        value={techInput}
        onChange={e => setTechInput(e.target.value)}
        className={"text-black"}
        placeholder="Add Technology"
      />
      <button onClick={handleAddTech}>Add Tech</button>

      {/* Team Member Input */}
      <input
        value={teamInput}
        onChange={e => setTeamInput(e.target.value)}
        className={"text-black"}
        placeholder="Add Team Member Name"
      />
      <input
        value={teamInputEmail}
        onChange={e => setTeamInputMail(e.target.value)}
        className={"text-black"}
        placeholder="Add Team Member Email"
      />
      <input
        value={teamInputRole}
        onChange={e => setTeamInputRole(e.target.value)}
        className={"text-black"}
        placeholder="Add Team Member Role"
      />
      <button onClick={handleAddTeamMember}>Add Member</button>

      {/* Submit Button */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Home;
