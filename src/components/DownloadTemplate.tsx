// 1️⃣ Add this function inside your UserManagement component
const handleDownloadTemplate = () => {
  // CSV headers for the template
  const csvContent = "id,name,email,department,level,access\n"; 
  // Optional: add example row
  // csvContent += "1,John Doe,john@example.com,Teacher,College,Admin\n";

  // Create a Blob (file) from CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a temporary link to trigger download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "user_template.csv"); // filename
  document.body.appendChild(link);
  link.click(); // trigger download
  document.body.removeChild(link); // cleanup
};
