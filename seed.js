const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const HealthRecord = require("./models/HealthRecord");
const Vital = require("./models/Vital");
const Appointment = require("./models/Appointment");
const Notification = require("./models/Notification");

dotenv.config();

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("Connected to MongoDB!");

    // Clear existing data
    await User.deleteMany();
    await HealthRecord.deleteMany();
    await Vital.deleteMany();
    await Appointment.deleteMany();
    await Notification.deleteMany();

    console.log("Cleared existing database collections.");

    // 1. Create Admin
    const admin = await User.create({
      name: "System Admin",
      email: "admin@patientcare.com",
      password: "admin123",
      role: "admin",
      phone: "+1 (555) 019-2834",
    });

    // 2. Create Doctors
    const doctor1 = await User.create({
      name: "Dr. Sarah Jenkins",
      email: "dr.sarah@patientcare.com",
      password: "doctor123",
      role: "doctor",
      phone: "+1 (555) 234-5678",
      specialization: "Cardiologist",
      department: "Cardiology",
      licenseNumber: "MD-84920",
    });

    const doctor2 = await User.create({
      name: "Dr. James Wilson",
      email: "dr.james@patientcare.com",
      password: "doctor123",
      role: "doctor",
      phone: "+1 (555) 345-6789",
      specialization: "General Physician",
      department: "Internal Medicine",
      licenseNumber: "MD-73911",
    });

    // 3. Create Patients
    const patient1 = await User.create({
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "patient123",
      role: "patient",
      phone: "+1 (555) 456-7890",
      gender: "male",
      dateOfBirth: new Date("1988-04-12"),
      bloodGroup: "O+",
      address: "742 Evergreen Terrace, Springfield, IL",
      emergencyContact: {
        name: "Jane Doe",
        phone: "+1 (555) 456-7899",
        relation: "Spouse",
      },
      assignedDoctor: doctor1._id,
    });

    const patient2 = await User.create({
      name: "Emily Clark",
      email: "emily.clark@gmail.com",
      password: "patient123",
      role: "patient",
      phone: "+1 (555) 567-8901",
      gender: "female",
      dateOfBirth: new Date("1994-09-23"),
      bloodGroup: "A+",
      address: "123 Main Street, Suite 4B, Chicago, IL",
      emergencyContact: {
        name: "Robert Clark",
        phone: "+1 (555) 567-8999",
        relation: "Father",
      },
      assignedDoctor: doctor2._id,
    });

    console.log("Created users: Admin, 2 Doctors, 2 Patients.");

    // 4. Create Vitals for Patient 1 (John Doe) - Time series over several days
    const now = new Date();
    const vitalsData = [
      {
        patient: patient1._id,
        recordedBy: patient1._id,
        heartRate: 74,
        bloodPressureSys: 122,
        bloodPressureDia: 80,
        temperature: 98.6,
        spO2: 98,
        bloodGlucose: 95,
        weight: 78,
        status: "Normal",
        notes: "Morning routine measurement. Feeling well.",
        recordedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        patient: patient1._id,
        recordedBy: patient1._id,
        heartRate: 76,
        bloodPressureSys: 125,
        bloodPressureDia: 82,
        temperature: 98.8,
        spO2: 97,
        bloodGlucose: 102,
        weight: 78,
        status: "Normal",
        notes: "Afternoon measurement post light jog.",
        recordedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        patient: patient1._id,
        recordedBy: doctor1._id,
        heartRate: 88,
        bloodPressureSys: 138,
        bloodPressureDia: 88,
        temperature: 99.1,
        spO2: 96,
        bloodGlucose: 110,
        weight: 77.5,
        status: "Warning",
        notes: "Clinic checkup. Elevated systolic blood pressure noted.",
        recordedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        patient: patient1._id,
        recordedBy: patient1._id,
        heartRate: 72,
        bloodPressureSys: 120,
        bloodPressureDia: 78,
        temperature: 98.4,
        spO2: 99,
        bloodGlucose: 92,
        weight: 77.5,
        status: "Normal",
        notes: "Following low-sodium dietary advice from Dr. Sarah.",
        recordedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        patient: patient1._id,
        recordedBy: patient1._id,
        heartRate: 70,
        bloodPressureSys: 118,
        bloodPressureDia: 76,
        temperature: 98.6,
        spO2: 99,
        bloodGlucose: 90,
        weight: 77.2,
        status: "Normal",
        notes: "Today's morning vitals. All values optimal.",
        recordedAt: now,
      },
      // Vitals for Emily Clark
      {
        patient: patient2._id,
        recordedBy: doctor2._id,
        heartRate: 68,
        bloodPressureSys: 115,
        bloodPressureDia: 75,
        temperature: 98.4,
        spO2: 99,
        bloodGlucose: 88,
        weight: 62,
        status: "Normal",
        notes: "Annual wellness checkup vitals.",
        recordedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        patient: patient2._id,
        recordedBy: patient2._id,
        heartRate: 72,
        bloodPressureSys: 118,
        bloodPressureDia: 76,
        temperature: 98.6,
        spO2: 98,
        bloodGlucose: 92,
        weight: 62.2,
        status: "Normal",
        notes: "Home monitoring log.",
        recordedAt: now,
      },
    ];

    await Vital.insertMany(vitalsData);
    console.log("Created historical vital signs logs.");

    // 5. Create Health Records
    await HealthRecord.create({
      patient: patient1._id,
      doctor: doctor1._id,
      recordType: "Consultation",
      title: "Cardiovascular Health Assessment",
      diagnosis: "Stage 1 Mild Hypertension - Well Managed",
      symptoms: ["Occasional mild dizziness", "Mild fatigue during heavy exertion"],
      notes: "Patient advised on regular aerobic exercise, 30 min/day, reducing sodium intake, and logging BP twice daily.",
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily in the morning",
          duration: "30 days",
          instructions: "Take with or without food. Monitor blood pressure.",
        },
        {
          name: "Omega-3 Fish Oil",
          dosage: "1000mg",
          frequency: "Once daily with lunch",
          duration: "60 days",
          instructions: "Cardiovascular support supplement.",
        },
      ],
      labResults: "Lipid Profile: Total Cholesterol 185 mg/dL (Normal), HDL 52 mg/dL, LDL 110 mg/dL, Triglycerides 120 mg/dL.",
      recordDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      followUpDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    });

    await HealthRecord.create({
      patient: patient2._id,
      doctor: doctor2._id,
      recordType: "Routine Checkup",
      title: "Annual General Physical Examination",
      diagnosis: "Healthy adult female, no acute medical concerns",
      symptoms: ["None"],
      notes: "Comprehensive physical exam within normal limits. Vaccinations up to date.",
      medications: [
        {
          name: "Vitamin D3",
          dosage: "2000 IU",
          frequency: "Daily with breakfast",
          duration: "90 days",
          instructions: "Take with meal containing dietary fat.",
        },
      ],
      labResults: "CBC: WBC 6.5, RBC 4.6, Hemoglobin 13.8 g/dL (Normal).",
      recordDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    });

    console.log("Created clinical health records.");

    // 6. Create Appointments
    await Appointment.create({
      patient: patient1._id,
      doctor: doctor1._id,
      appointmentDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      timeSlot: "10:30 AM",
      type: "In-Person",
      reason: "Blood pressure follow-up and prescription review",
      status: "confirmed",
      doctorNotes: "Review 14-day blood pressure trend log.",
    });

    await Appointment.create({
      patient: patient2._id,
      doctor: doctor2._id,
      appointmentDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      timeSlot: "02:00 PM",
      type: "Video Consultation",
      reason: "Nutrition and wellness consultation",
      status: "pending",
    });

    await Appointment.create({
      patient: patient1._id,
      doctor: doctor1._id,
      appointmentDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      timeSlot: "11:00 AM",
      type: "In-Person",
      reason: "Initial cardiovascular evaluation",
      status: "completed",
      doctorNotes: "Initial checkup completed. Prescribed Lisinopril 10mg.",
    });

    console.log("Created appointments (Confirmed, Pending, Completed).");

    // 7. Create Notifications
    await Notification.create({
      recipient: patient1._id,
      sender: doctor1._id,
      title: "Appointment Confirmed",
      message: "Dr. Sarah Jenkins confirmed your appointment for in 2 days at 10:30 AM.",
      type: "appointment",
      isRead: false,
      link: "/patient/appointments",
    });

    await Notification.create({
      recipient: patient1._id,
      sender: doctor1._id,
      title: "New Health Record Added",
      message: "Dr. Sarah Jenkins published your Cardiovascular Health Assessment report.",
      type: "record",
      isRead: false,
      link: "/patient/records",
    });

    await Notification.create({
      recipient: doctor1._id,
      sender: patient1._id,
      title: "New Patient Appointment Request",
      message: "John Doe scheduled a follow-up consultation.",
      type: "appointment",
      isRead: false,
      link: "/doctor/appointments",
    });

    console.log("=========================================");
    console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=========================================");
    console.log("Sample Credentials for testing:");
    console.log("-----------------------------------------");
    console.log("ADMIN:   admin@patientcare.com     / admin123");
    console.log("DOCTOR:  dr.sarah@patientcare.com   / doctor123");
    console.log("DOCTOR:  dr.james@patientcare.com   / doctor123");
    console.log("PATIENT: john.doe@gmail.com        / patient123");
    console.log("PATIENT: emily.clark@gmail.com      / patient123");
    console.log("=========================================");

    process.exit(0);
  } catch (error) {
    console.error("Database Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
