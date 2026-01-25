#include <stdio.h>
#include <math.h>

int main(void) {
    double x;

    printf("Entrez x : ");
    if (scanf("%lf", &x) != 1) {
        return 1;
    }

    printf("sqrt(x) = %.6f\n", sqrt(x));
    printf("cos(x) = %.6f\n", cos(x));

    return 0;
}
