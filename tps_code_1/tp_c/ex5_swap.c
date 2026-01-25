#include <stdio.h>

int main(void) {
    int a, b, temp;

    printf("Entrez deux nombres : ");
    if (scanf("%d %d", &a, &b) != 2) {
        return 1;
    }

    temp = a;
    a = b;
    b = temp;

    printf("Apres echange : a = %d, b = %d\n", a, b);

    return 0;
}
