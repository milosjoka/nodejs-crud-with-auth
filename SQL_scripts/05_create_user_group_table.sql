CREATE TABLE user_group(
  user_id UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  group_id UUID REFERENCES groups (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT user_group_pkey PRIMARY KEY (user_id, group_id)
);