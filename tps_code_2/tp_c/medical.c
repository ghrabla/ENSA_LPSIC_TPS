#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define RESET   "\033[0m"
#define BOLD    "\033[1m"
#define RED     "\033[1;31m"
#define GREEN   "\033[1;32m"
#define YELLOW  "\033[1;33m"
#define CYAN    "\033[1;36m"
#define WHITE   "\033[1;37m"
#define DIM     "\033[2m"

typedef struct {
    int id;
    char name[50];
    int age;
    char phone[15];
} Patient;

typedef struct {
    int patientId;
    char date[11];
    char time[6];
    char reason[100];
} Appointment;

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
        printf("\n" CYAN BOLD "╔══════════════════════════════════╗\n");
        printf(           "║   MEDICAL CABINET MANAGEMENT     ║\n");
        printf(           "╚══════════════════════════════════╝" RESET "\n");
        printf(YELLOW "  1. " RESET "Add Patient\n");
        printf(YELLOW "  2. " RESET "List All Patients\n");
        printf(YELLOW "  3. " RESET "Schedule Appointment\n");
        printf(YELLOW "  4. " RESET "List All Appointments\n");
        printf(YELLOW "  5. " RESET "Exit\n");
        printf(CYAN "\nSelect an option: " RESET);
        scanf("%d", &choice);

        switch (choice) {
            case 1: addPatient();        break;
            case 2: listPatients();      break;
            case 3: addAppointment();    break;
            case 4: listAppointments();  break;
            case 5:
                printf(GREEN "Goodbye!" RESET "\n");
                exit(0);
            default:
                printf(RED "Invalid choice. Please try again." RESET "\n");
        }
    }
}

void addPatient() {
    FILE *fp = fopen("patients.dat", "ab");
    if (!fp) {
        printf(RED "Error: could not open patients file." RESET "\n");
        return;
    }

    Patient p;
    printf(CYAN "\n--- Add Patient ---" RESET "\n");
    printf(YELLOW "  Patient ID : " RESET);
    scanf("%d", &p.id);
    printf(YELLOW "  Name       : " RESET);
    scanf(" %49[^\n]", p.name);
    printf(YELLOW "  Age        : " RESET);
    scanf("%d", &p.age);
    printf(YELLOW "  Phone      : " RESET);
    scanf("%14s", p.phone);

    fwrite(&p, sizeof(Patient), 1, fp);
    fclose(fp);
    printf(GREEN "\n  ✔ Patient added successfully!" RESET "\n");
}

void listPatients() {
    FILE *fp = fopen("patients.dat", "rb");
    if (!fp) {
        printf(YELLOW "\n  No patient records found." RESET "\n");
        return;
    }

    Patient p;
    printf(CYAN BOLD "\n  %-6s  %-30s  %-5s  %-15s\n" RESET,
           "ID", "Name", "Age", "Phone");
    printf(DIM "  ");
    for (int i = 0; i < 62; i++) printf("-");
    printf(RESET "\n");

    int count = 0;
    while (fread(&p, sizeof(Patient), 1, fp)) {
        printf("  " YELLOW "%-6d" RESET "  " WHITE "%-30s" RESET
               "  " CYAN "%-5d" RESET "  " "%-15s" "\n",
               p.id, p.name, p.age, p.phone);
        count++;
    }
    fclose(fp);

    if (count == 0)
        printf(YELLOW "  No records to display." RESET "\n");
    else {
        printf(DIM "  ");
        for (int i = 0; i < 62; i++) printf("-");
        printf(RESET "\n");
        printf(GREEN "  %d patient(s) found." RESET "\n", count);
    }
}

void addAppointment() {
    FILE *fp = fopen("appointments.dat", "ab");
    if (!fp) {
        printf(RED "Error: could not open appointments file." RESET "\n");
        return;
    }

    Appointment a;
    printf(CYAN "\n--- Schedule Appointment ---" RESET "\n");
    printf(YELLOW "  Patient ID  : " RESET);
    scanf("%d", &a.patientId);
    printf(YELLOW "  Date (YYYY-MM-DD) : " RESET);
    scanf("%10s", a.date);
    printf(YELLOW "  Time (HH:MM)      : " RESET);
    scanf("%5s", a.time);
    printf(YELLOW "  Reason      : " RESET);
    scanf(" %99[^\n]", a.reason);

    fwrite(&a, sizeof(Appointment), 1, fp);
    fclose(fp);
    printf(GREEN "\n  ✔ Appointment scheduled successfully!" RESET "\n");
}

void listAppointments() {
    FILE *fp = fopen("appointments.dat", "rb");
    if (!fp) {
        printf(YELLOW "\n  No appointment records found." RESET "\n");
        return;
    }

    Appointment a;
    printf(CYAN BOLD "\n  %-10s  %-12s  %-6s  %-30s\n" RESET,
           "Patient ID", "Date", "Time", "Reason");
    printf(DIM "  ");
    for (int i = 0; i < 64; i++) printf("-");
    printf(RESET "\n");

    int count = 0;
    while (fread(&a, sizeof(Appointment), 1, fp)) {
        printf("  " YELLOW "%-10d" RESET "  "
               CYAN "%-12s" RESET "  "
               WHITE "%-6s" RESET "  "
               "%-30s" "\n",
               a.patientId, a.date, a.time, a.reason);
        count++;
    }
    fclose(fp);

    if (count == 0)
        printf(YELLOW "  No records to display." RESET "\n");
    else {
        printf(DIM "  ");
        for (int i = 0; i < 64; i++) printf("-");
        printf(RESET "\n");
        printf(GREEN "  %d appointment(s) found." RESET "\n", count);
    }
}