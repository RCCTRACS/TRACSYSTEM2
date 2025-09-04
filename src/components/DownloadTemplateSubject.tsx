const handleDownloadTemplate = () => {
  // Only CSV headers, no example/mock data
  const csvContent = "Subject ID,Subject Name,Year Level,Instructor\n";

  // Create a Blob (file) from CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a temporary link to trigger download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "subject_template.csv"); // filename
  document.body.appendChild(link);
  link.click(); // trigger download
  document.body.removeChild(link); // cleanup
};
