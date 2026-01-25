#include <stdio.h>

int main(void) {
    double a, b;
    char op;

    printf("Entrez une operation (ex: 5 + 7) : ");
    if (scanf("%lf %c %lf", &a, &op, &b) != 3) {
        return 1;
    }

    double resultat;
    int valide = 1;

    switch (op) {
        case '+':
            resultat = a + b;
            break;
        case '-':
            resultat = a - b;
            break;
        case '*':
            resultat = a * b;
            break;
        case '/':
            if (b == 0) {
                printf("Division par zero.\n");
                return 1;
            }
            resultat = a / b;
            break;
        default:
            valide = 0;
            break;
    }

    if (!valide) {
        printf("Operateur non valide.\n");
        return 1;
    }

    printf("%.2f %c %.2f = %.2f\n", a, op, b, resultat);

    return 0;
}
