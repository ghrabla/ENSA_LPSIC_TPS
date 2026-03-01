#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Structures
typedef struct {
    int id;
    char name[50];
    int age;
    char phone[15];
} Patient;

typedef struct {
    int patientId;
    char date[11]; // YYYY-MM-DD
    char time[6];  // HH:MM
    char reason[100];
} Appointment;

// Function Prototypes
void addPatient();
void listPatients();
void addAppointment();
void listAppointments();
void mainMenu();

int main() {
    mainMenu();
    return 0;
}

void mainMenu() {
    int choice;
    while (1) {
        printf("\n--- MEDICAL CABINET MANAGEMENT ---\n");
        printf("1. Add Patient\n");
        printf("2. List All Patients\n");
        printf("3. Schedule Appointment (Rendez-vous)\n");
        printf("4. List All Appointments\n");
        printf("5. Exit\n");
        printf("Select an option: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addPatient(); break;
            case 2: listPatients(); break;
            case 3: addAppointment(); break;
            case 4: listAppointments(); break;
            case 5: printf("Exiting system...\n"); exit(0);
            default: printf("Invalid choice. Try again.\n");
        }
    }
}

void addPatient() {
    FILE *fp = fopen("patients.dat", "ab");
    if (!fp) {
        printf("Error opening file!\n");
        return;
    }

    Patient p;
    printf("\nEnter Patient ID: ");
    scanf("%d", &p.id);
    printf("Enter Name: ");
    scanf(" %[^\n]s", p.name); // Reads string with spaces
    printf("Enter Age: ");
    scanf("%d", &p.age);
    printf("Enter Phone: ");
    scanf("%s", p.phone);

    fwrite(&p, sizeof(Patient), 1, fp);
    fclose(fp);
    printf("Patient added successfully!\n");
}

void listPatients() {
    FILE *fp = fopen("patients.dat", "rb");
    if (!fp) {
        printf("\nNo patient records found.\n");
        return;
    }

    Patient p;
    printf("\n--- Patient List ---\n");
    printf("ID\tName\t\tAge\tPhone\n");
    printf("--------------------------------------------\n");
    while (fread(&p, sizeof(Patient), 1, fp)) {
        printf("%d\t%-15s\t%d\t%s\n", p.id, p.name, p.age, p.phone);
    }
    fclose(fp);
}

void addAppointment() {
    FILE *fp = fopen("appointments.dat", "ab");
    if (!fp) {
        printf("Error opening file!\n");
        return;
    }

    Appointment a;
    printf("\nEnter Patient ID for Appointment: ");
    scanf("%d", &a.patientId);
    printf("Enter Date (YYYY-MM-DD): ");
    scanf("%s", a.date);
    printf("Enter Time (HH:MM): ");
    scanf("%s", a.time);
    printf("Enter Reason: ");
    scanf(" %[^\n]s", a.reason);

    fwrite(&a, sizeof(Appointment), 1, fp);
    fclose(fp);
    printf("Appointment scheduled successfully!\n");
}

void listAppointments() {
    FILE *fp = fopen("appointments.dat", "rb");
    if (!fp) {
        printf("\nNo appointment records found.\n");
        return;
    }

    Appointment a;
    printf("\n--- Scheduled Appointments ---\n");
    printf("Patient ID\tDate\t\tTime\tReason\n");
    printf("----------------------------------------------------------\n");
    while (fread(&a, sizeof(Appointment), 1, fp)) {
        printf("%d\t\t%s\t%s\t%s\n", a.patientId, a.date, a.time, a.reason);
    }
    fclose(fp);
}