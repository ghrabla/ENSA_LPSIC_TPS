FROM wordpress:php8.3-fpm

COPY php.ini /usr/local/etc/php/php.ini

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    sudo \
    python3 \
    vim \
    wget \
    zsh \
    nano \
    net-tools \
    htop \
    iputils-ping \
    procps \
    libnss3 \
    ca-certificates \
    gnupg \
    libmemcached-dev \
    zlib1g-dev \
    libssl-dev


# Install PHP extension dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libicu-dev \
    libzip-dev \
    libmagickwand-dev \
    libxml2-dev \
    libonig-dev \
    libpq-dev \
    postgresql-server-dev-all

# Install PostGIS dependencies
RUN apt-get update && apt-get install -y \
    postgis \
    gdal-bin \
    postgresql-client

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd \
    bcmath \
    intl \
    opcache \
    zip \
    pcntl \
    soap \
    pdo_mysql \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pgsql pdo_pgsql

# Install Node.js
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && mkdir -p /root/.npm \
    && chown -R root:root /root/.npm \
    && npm config set prefix /usr/local \
    && npm install -g npm@latest

ENV NODE_PATH=/usr/local/lib/node_modules
ENV PATH=/usr/local/bin:$PATH

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Memcached extension
RUN pecl install -f memcached-3.2.0 && docker-php-ext-enable memcached

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Remove WordPress core files
RUN rm -rf /var/www/*

# Create necessary directories
RUN mkdir -p /var/log/done /var/www \
    && chown -R www-data:www-data /var/log/ /var/www /usr/local/etc/php/

# Install Xdebug
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/
RUN install-php-extensions xdebug
COPY docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www
