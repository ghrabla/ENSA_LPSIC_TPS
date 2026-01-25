#include <stdio.h>

int main(void) {
    double prix_ht;
    double tva = 0.20;

    printf("Entrez le prix hors taxe : ");
    if (scanf("%lf", &prix_ht) != 1) {
        return 1;
    }

    double prix_ttc = prix_ht * (1.0 + tva);
    printf("Prix TTC (TVA 20%%) : %.2f\n", prix_ttc);

    return 0;
}
