#include <stdio.h>
#include <math.h>

int main(void) {
    double rayon;
    const double PI = 3.141592653589793;

    printf("Entrez le rayon du cercle : ");
    if (scanf("%lf", &rayon) != 1) {
        return 1;
    }

    double surface = PI * rayon * rayon;
    double perimetre = 2.0 * PI * rayon;

    printf("Surface : %.2f\n", surface);
    printf("Perimetre : %.2f\n", perimetre);

    return 0;
}
