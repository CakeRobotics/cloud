FROM images.cakerobotics.com/mostafa/org-docs-engine:alpha AS builder

WORKDIR /docs
COPY . ./
RUN python /engine/main.py make-all

FROM nginx
COPY --from=builder /docs/out /usr/share/nginx/html