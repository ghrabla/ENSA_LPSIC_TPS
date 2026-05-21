FROM apache/airflow:3.0.4

WORKDIR /opt/airflow

USER root

COPY data-core/airflow/requirements.txt /opt/airflow/requirements.txt

COPY mason/data/airflow/init-airflow.sh /opt/airflow/init-airflow.sh
RUN chmod +x /opt/airflow/init-airflow.sh

COPY mason/data/airflow/airflow.cfg /opt/airflow/config/airflow.cfg

USER airflow

RUN pip install --no-cache-dir -r /opt/airflow/requirements.txt
