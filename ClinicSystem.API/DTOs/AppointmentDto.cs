namespace ClinicSystem.API.DTOs
{
    public class CreateAppointmentDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class UpdateAppointmentStatusDto
    {
        public string Status { get; set; } = string.Empty; // "Confirmed" or "Cancelled"
    }
}

/*
The Status in UpdateAppointmentStatusDto starts empty (string.Empty [+ this is a default value])
because it's just a container waiting to receive the value from the frontend.
*/
