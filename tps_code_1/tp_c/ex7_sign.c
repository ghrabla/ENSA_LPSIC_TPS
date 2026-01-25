#include <stdio.h>

int main(void) {
    int n;

    printf("Entrez n : ");
    if (scanf("%d", &n) != 1) {
        return 1;
    }

    int signe = (n < 0) ? -1 : (n > 0 ? 1 : 0);
    printf("Signe : %d\n", signe);

    return 0;
}
