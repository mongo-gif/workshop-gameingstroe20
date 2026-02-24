FROM php:8.2-apache

# Install extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable apache mod_rewrite
RUN a2enmod rewrite

# Update apache config to handle Authorization header if needed and allow .htaccess
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copy application source
COPY . /var/www/html/

WORKDIR /var/www/html
